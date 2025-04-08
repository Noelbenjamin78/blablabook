import { Router } from 'express';
import { createLibraryEntry } from '../controllers/library.controller';

const router = Router();

router.post('/', createLibraryEntry);
router.delete('/:id', deleteLibraryEntry);

export default router;