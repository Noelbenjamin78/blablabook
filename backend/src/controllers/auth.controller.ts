import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { createUser, findUserByEmailOrUsername } from '../repositories/auth.repository';
import { NewUser, User } from '../types/user';

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