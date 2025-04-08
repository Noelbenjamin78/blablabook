import express from 'express';
import cors from 'cors';
import './db'; 
import booksRoutes from './routes/books.routes';
import searchRoutes from './routes/search.routes';

const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
  }));
app.use(express.json());

app.use('/api/books', booksRoutes);
app.use('/api/search', searchRoutes);

export default app;