import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './db'; 
import booksRoutes from './routes/books.routes';
import searchRoutes from './routes/search.routes';
import libraryRoutes from './routes/library.routes';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
  }));
app.use(express.json());

app.use('/api/books', booksRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/auth', authRoutes);

export default app;