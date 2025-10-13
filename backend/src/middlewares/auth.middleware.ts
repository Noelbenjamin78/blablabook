import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'blablabook_dev_secret';

interface JwtPayload {
  id: number;
  username: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const verifyToken: RequestHandler = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ error: 'Token manquant' });
    return;
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};