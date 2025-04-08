import { Request, Response } from 'express';
import { addToLibrary, removeFromLibrary } from '../repositories/library.repository';

export const createLibraryEntry = async (req: Request, res: Response): Promise<void> => {
  const { user_id, book_id } = req.body;

  if (!user_id || !book_id) {
    res.status(400).json({ error: 'user_id et book_id sont requis' });
    return;
  }

  try {
    const entry = await addToLibrary({ user_id, book_id });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l’ajout à la bibliothèque' });
  }
};

export const deleteLibraryEntry = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: 'ID invalide' });
    return;
  }

  try {
    const deleted = await removeFromLibrary(id);
    if (!deleted) {
      res.status(404).json({ error: 'Entrée non trouvée' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};