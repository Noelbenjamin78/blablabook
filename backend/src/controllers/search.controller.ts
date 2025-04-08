import { Request, Response } from 'express';
import { searchBooksByTitle } from '../repositories/book.repository';

export const searchBooks = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.query;

  if (!name || typeof name !== 'string') {
    res.status(400).json({ error: 'Le paramètre "name" est requis' });
    return;
  }

  try {
    const books = await searchBooksByTitle(name);
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la recherche' });
  }
};