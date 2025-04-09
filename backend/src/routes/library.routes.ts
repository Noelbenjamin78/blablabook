import { Router } from 'express';
import { createLibraryEntry, deleteLibraryEntry, updateLibraryEntryStatus, getUserLibraryEntries } from '../controllers/library.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', verifyToken, createLibraryEntry);
router.delete('/:id', verifyToken, deleteLibraryEntry);
router.patch('/:id/status', verifyToken, updateLibraryEntryStatus);
router.get('/:userId', verifyToken, getUserLibraryEntries)


export default router;