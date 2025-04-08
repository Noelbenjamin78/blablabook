import { Router } from 'express';
import { createLibraryEntry, deleteLibraryEntry, updateLibraryEntryStatus, getUserLibraryEntries } from '../controllers/library.controller';

const router = Router();

router.post('/', createLibraryEntry);
router.delete('/:id', deleteLibraryEntry);
router.patch('/:id/status', updateLibraryEntryStatus);
router.get('/:userId', getUserLibraryEntries)


export default router;