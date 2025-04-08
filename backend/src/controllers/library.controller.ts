import { Request, Response } from 'express';
import { addToLibrary, removeFromLibrary, updateLibraryStatus, getLibraryByUser } from '../repositories/library.repository';

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

export const getUserLibraryEntries = async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.userId, 10);
  const statusQuery = req.query.status;

  if (isNaN(userId)) {
    res.status(400).json({ error: 'Paramètre userId invalide' });
    return;
  }

  // handle status if provided as a query parameter in the request URL
  let status: number | undefined;
  if (statusQuery === 'read') {
      status = 1
  } else if (statusQuery === 'toread') {
      status = 0;
  } else if (statusQuery !== null && statusQuery !== undefined) {
      res.status(400).json({ error: 'status doit être "read" ou "toread"' });
      return;
  }

  try {
    const entries = await getLibraryByUser(userId, status);
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la bibliothèque' });
  }
};