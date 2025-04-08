import { Request, Response } from 'express';
import { addToLibrary, removeFromLibrary, updateLibraryStatus } from '../repositories/library.repository';

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

export const updateLibraryEntryStatus = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  const { status } = req.body;

  if (isNaN(id)) {
    res.status(400).json({ error: 'ID invalide' });
    return;
  }

  if (status !== 0 && status !== 1) {
    res.status(400).json({ error: 'Le statut doit être 0 (to read) ou 1 (read)' });
    return;
  }

  try {
    const updated = await updateLibraryStatus(id, status);
    if (!updated) {
      res.status(404).json({ error: 'Entrée non trouvée' });
      return;
    }
    res.status(200).json({ message: `Statut mis à jour pour l'entrée id : ${id}` });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
  }
};