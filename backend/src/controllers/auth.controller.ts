// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
// Use require to avoid TypeScript declaration issues inside the container
const validator: any = require('validator');
import * as bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from 'jsonwebtoken';
import {
  createUser,
  findUserByEmailOrUsername,
  findUserByEmail,
  saveResetTokenForUser,
  findUserByResetToken,
  clearResetTokenForUser,
  updateUserPassword,
  getLastPasswordHashes,   // retourne tableau des N derniers hashes (y compris actuel)
  addPasswordToHistory     // insère un hash dans l'historique
} from '../repositories/auth.repository';
import { NewUser, User } from '../types/user';

const SECRET_KEY = process.env.JWT_SECRET || 'blablabook_dev_secret';
const BCRYPT_ROUNDS = 12; 
const PASSWORD_HISTORY_COUNT = 3;
const RESET_TOKEN_TTL_MIN = 15;

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
  if (!validator.isLength(password, { min: 12 })) {
    res.status(400).json({ error: 'Mot de passe trop court' });
    return;
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) { res.status(401).json({ error: 'Identifiants invalides' }); return; }

    const match = await bcrypt.compare(password, (user as any).password);
    if (!match) { res.status(401).json({ error: 'Identifiants invalides' }); return; }

    const token = jwt.sign({ id: (user as any).id, username: (user as any).username, email: (user as any).email }, SECRET_KEY, { expiresIn: '24h' });
    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      })
      .status(200)
      .json({ userId: (user as any).id });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
};

// --- Demande de reset : génère un token (optionnel si tu ne fais pas d'email) ---
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

  await saveResetTokenForUser((user as any).id, tokenHash, expiresAt);

  // TODO: envoyer par email. Pour les tests, on log le lien :
  const resetLink = `${process.env.FRONT_URL ?? "http://localhost:5173"}/forgot-password?token=${raw}&email=${encodeURIComponent(email)}`;
  console.log("🔗 Reset link:", resetLink);

  res.status(200).json({ ok: true });
  return;
};

// --- Réinitialisation avec OU sans token (simple, typage permissif) ---
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = (req.body ?? {}) as {
      token?: string;
      email?: string;
      newPassword?: string;
      password?: string;
      confirmPassword?: string;
    };

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : undefined;
    const finalPassword = (body.newPassword ?? body.password)?.trim();

    if (!email) {
      res.status(400).json({ error: "Paramètres manquants: email requis." });
      return;
    }
    if (!validator.isEmail(email)) {
      res.status(400).json({ error: "Email invalide." });
      return;
    }
    if (!finalPassword) {
      res.status(400).json({ error: "Paramètres manquants: mot de passe requis." });
      return;
    }
    if (body.confirmPassword && body.confirmPassword !== finalPassword) {
      res.status(400).json({ error: "Les mots de passe ne correspondent pas." });
      return;
    }
    if (!validator.isLength(finalPassword, { min: 12 })) {
      res.status(400).json({ error: "Le mot de passe doit contenir au moins 12 caractères." });
      return;
    }

    // Helper: vérifie l'historique et met à jour
    const checkHistoryAndUpdate = async (user: any) => {
      // récupère les derniers hashes
      let lastHashes: string[] = [];
      try {
        const raw = await getLastPasswordHashes(user.id, PASSWORD_HISTORY_COUNT);
        if (Array.isArray(raw)) lastHashes = raw.filter((h: any) => typeof h === "string");
      } catch (e) {
        console.error("getLastPasswordHashes error:", e);
      }

      // construit la liste à comparer (ancien + historique)
      const compareList: string[] = [];
      if (typeof user.password === "string" && user.password.length > 0) {
        compareList.push(user.password);
      }
      for (const h of lastHashes) {
        if (typeof h === "string" && h.length > 0) compareList.push(h);
      }

      // refuse si réutilisé récemment
      for (const oldHash of compareList.slice(0, PASSWORD_HISTORY_COUNT)) {
        try {
          if (await bcrypt.compare(finalPassword!, oldHash)) {
            return { ok: false as const, status: 409, error: "Vous avez déjà utilisé ce mot de passe récemment." };
          }
        } catch (e) {
          console.error("bcrypt.compare error:", e);
        }
      }

      const newHash = await bcrypt.hash(finalPassword!, BCRYPT_ROUNDS);

      // archive l'ancien si présent
      if (typeof user.password === "string" && user.password.length > 0) {
        try { await addPasswordToHistory(user.id, user.password); }
        catch (e) { console.error("addPasswordToHistory error:", e); }
      }

      await updateUserPassword(user.id, newHash);
      return { ok: true as const };
    };

    // ----- Flux 1 : avec token -----
    if (body.token && body.token.trim() !== "") {
      const tokenHash = crypto.createHash("sha256").update(body.token).digest("hex");

      let user: any;
      try {
        user = await findUserByResetToken(email, tokenHash);
      } catch (e) {
        console.error("findUserByResetToken error:", e);
        res.status(500).json({ error: "Erreur serveur." });
        return;
      }

      if (!user || !user.resetTokenExpiresAt || user.resetTokenExpiresAt < new Date()) {
        res.status(400).json({ error: "Lien invalide ou expiré" });
        return;
      }

      const result = await checkHistoryAndUpdate(user);
      if (!result.ok) {
        res.status(result.status).json({ error: result.error });
        return;
      }

      try { await clearResetTokenForUser(user.id); }
      catch (e) { console.error("clearResetTokenForUser error:", e); }

      res.status(200).json({ ok: true });
      return;
    }

    // ----- Flux 2 : sans token (email saisi) -----
    let user: any;
    try {
      user = await findUserByEmail(email);
    } catch (e) {
      console.error("findUserByEmail error:", e);
      res.status(500).json({ error: "Erreur serveur." });
      return;
    }

    // privacy: ne révèle pas si l'email existe
    if (!user) {
      res.status(200).json({ ok: true });
      return;
    }

    const result = await checkHistoryAndUpdate(user);
    if (!result.ok) {
      res.status(result.status).json({ error: result.error });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (e) {
    console.error("resetPassword fatal error:", e);
    res.status(500).json({ error: "Erreur serveur." });
  }
};
