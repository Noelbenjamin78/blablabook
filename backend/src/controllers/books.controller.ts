import { Request, Response } from 'express';
import { getAllBooks, getOneBookById } from '../repositories/book.repository';

export const getBooks = async (req: Request, res: Response): Promise<void> => {
    try {
      const books = await getAllBooks();
      res.json(books);
    } catch (err) {
      res.status(500).json({ error: 'Erreur lors de la récupération des livres' });
    }
  };

export const getBook = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
       res.status(400).json({ error: 'ID invalide' });
       return;
    }
  
    try {
      const book = await getOneBookById(id);
      if (!book) {
        res.status(404).json({ error: 'Livre non trouvé' });
        return;
      }
      res.json(book); 
    } catch (err) {
      res.status(500).json({ error: 'Erreur lors de la récupération du livre' }); 
    }
  };