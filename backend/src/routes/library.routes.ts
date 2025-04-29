import { Router } from 'express';
import { createLibraryEntry, deleteLibraryEntry, updateLibraryEntryStatus, getUserLibraryEntries, getUserBookEntry } from '../controllers/library.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', verifyToken, createLibraryEntry);
router.delete('/:id', verifyToken, deleteLibraryEntry);
router.patch('/:id/status', verifyToken, updateLibraryEntryStatus);
router.get('/:userId', verifyToken, getUserLibraryEntries)
router.get('/user/:userId/book/:bookId', verifyToken, getUserBookEntry);

export default router;