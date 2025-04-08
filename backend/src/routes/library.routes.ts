import { Router } from 'express';
import { createLibraryEntry, deleteLibraryEntry, updateLibraryEntryStatus } from '../controllers/library.controller';

const router = Router();

router.post('/', createLibraryEntry);
router.delete('/:id', deleteLibraryEntry);
router.patch('/:id/status', updateLibraryEntryStatus);


export default router;