import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import './db';
import booksRoutes from './routes/books.routes';
import searchRoutes from './routes/search.routes';
import libraryRoutes from './routes/library.routes';
import authRoutes from './routes/auth.routes';


dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://yannicksendrey-server.eddi.cloud:3000',
  'https://blablabook.live'
];

// Middleware to handle CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: origin ${origin} not allowed.`));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/books', booksRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/auth', authRoutes);

export default app;