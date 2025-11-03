import express, { Request, Response } from 'express';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import './db';
import booksRoutes from './routes/books.routes';
import searchRoutes from './routes/search.routes';
import libraryRoutes from './routes/library.routes';
import authRoutes from './routes/auth.routes';

// Extend Express Request type to include csrfToken
declare global {
  namespace Express {
    interface Request {
      csrfToken: () => string;
    }
  }
}

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
// Route pour exposer le token CSRF au frontend
const csrfProtection = csurf({ cookie: true });
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use('/api/books', booksRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/auth', authRoutes);

export default app;