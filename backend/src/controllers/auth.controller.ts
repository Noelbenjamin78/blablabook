import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmailOrUsername, findUserByEmail } from '../repositories/auth.repository';
import { NewUser, User, UserWithPassword } from '../types/user';

const SECRET_KEY = process.env.JWT_SECRET || 'blablabook_dev_secret';

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

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: User = await createUser(username, email, hashedPassword);

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l’inscription' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      res.status(400).json({ error: 'Email et mot de passe requis' });
      return;
    }
  
    try {
        const user = await findUserByEmail(email);
      if (!user) {
        res.status(401).json({ error: 'Identifiants invalides' });
        return;
      }
  
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        res.status(401).json({ error: 'Identifiants invalides' });
        return;
      }
  
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email
        },
        SECRET_KEY,
        { expiresIn: '24h' }
      );
  
      res.status(200).json({ token, userId: user.id });
    } catch (err) {
      res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
  };