// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import validator from 'validator';
import * as bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from 'jsonwebtoken';
import {
  createUser,
  findUserByEmailOrUsername,
  findUserByEmail,
  // 👉 à implémenter dans repositories :
  saveResetTokenForUser,
  findUserByResetToken,
  clearResetTokenForUser,
  updateUserPassword,
  getLastPasswordHashes,   // retourne tableau des N derniers hashes (y compris actuel)
  addPasswordToHistory     // insère un hash dans l'historique
} from '../repositories/auth.repository';
import { NewUser, User } from '../types/user';

const SECRET_KEY = process.env.JWT_SECRET || 'blablabook_dev_secret';
const BCRYPT_ROUNDS = 12; // un peu plus costaud
const PASSWORD_HISTORY_COUNT = 3;
const RESET_TOKEN_TTL_MIN = 15;

// --- code register/login : inchangé (tu peux juste passer à 12 rounds) ---

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password }: NewUser = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ error: 'Champs requis manquants' });
    return;
  }

  try {
    const existingUser: User | undefined = await findUserByEmailOrUsername(email, username);
    if (existingUser) {
      res.status(409).json({ error: 'Utilisateur déjà existant (email ou pseudo)' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const newUser: User = await createUser(username, email, hashedPassword);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l’inscription' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  let { email, password } = req.body;
  // Validation et sanitisation
  email = typeof email === 'string' ? validator.trim(email) : '';
  password = typeof password === 'string' ? validator.trim(password) : '';
  if (!validator.isEmail(email)) {
    res.status(400).json({ error: 'Email invalide' });
    return;
  }
  if (!validator.isLength(password, { min: 6 })) {
    res.status(400).json({ error: 'Mot de passe trop court' });
    return;
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) { res.status(401).json({ error: 'Identifiants invalides' }); return; }

    const match = await bcrypt.compare(password, user.password);
    if (!match) { res.status(401).json({ error: 'Identifiants invalides' }); return; }

    const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      })
      .status(200)
      .json({ userId: user.id });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
};

// --- Nouveau : demande de reset ---
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body as { email?: string };
  if (!email) {
    res.status(400).json({ error: "Email requis" });
    return;
  }

  const user = await findUserByEmail(email);
  // Ne pas révéler si l'email existe (privacy)
  if (!user) {
    res.status(200).json({ ok: true });
    return;
  }

  // Génère un token brut + hash
  const raw = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(raw).digest("hex");
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MIN * 60 * 1000);

  await saveResetTokenForUser(user.id, tokenHash, expiresAt);

  // TODO: envoyer par email. Pour les tests, on log le lien :
  const resetLink = `${process.env.FRONT_URL ?? "http://localhost:5173"}/forgot-password?token=${raw}&email=${encodeURIComponent(email)}`;
  console.log("🔗 Reset link:", resetLink);

  res.status(200).json({ ok: true });
  return;
};

// --- Nouveau : réinitialisation avec token ---
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token, email, newPassword } = req.body as { token?: string; email?: string; newPassword?: string; };
  if (!token || !email || !newPassword) {
    res.status(400).json({ error: "Paramètres manquants" });
    return;
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const user = await findUserByResetToken(email, tokenHash);
  if (!user || !user.resetTokenExpiresAt || user.resetTokenExpiresAt < new Date()) {
    res.status(400).json({ error: "Lien invalide ou expiré" });
    return;
  }

  // Récupère l'historique des 3 derniers mots de passe (incluant actuel)
  const lastHashes = await getLastPasswordHashes(user.id, PASSWORD_HISTORY_COUNT);
  // On ajoute le hash actuel si pas déjà dedans :
  if (user.password) lastHashes.unshift(user.password);

  // Refuser si le nouveau mdp matche l'un des anciens
  for (const oldHash of lastHashes.slice(0, PASSWORD_HISTORY_COUNT)) {
    const same = await bcrypt.compare(newPassword, oldHash);
    if (same) {
      res.status(409).json({ error: "Vous avez déjà utilisé ce mot de passe récemment." });
      return;
    }
  }

  // Tout est ok → hasher, maj user, archiver l'ancien
  const newHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

  // Archiver l'ancien si présent
  if (user.password) {
    await addPasswordToHistory(user.id, user.password);
  }

  await updateUserPassword(user.id, newHash);
  await clearResetTokenForUser(user.id);

  res.status(200).json({ ok: true });
  return;
};
