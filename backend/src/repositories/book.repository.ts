import db from '../db';
import { Book } from '../types/book';

export const getAllBooks = async (): Promise<Book[]> => {
  const result = await db.query(`
    SELECT b.*, g.name AS genre_name
    FROM book b
    LEFT JOIN genre g ON b.genre_id = g.id
  `);
  return result.rows;
};

export const getOneBookById = async (id: number): Promise<Book | null> => {
  const result = await db.query(`
    SELECT b.*, g.name AS genre_name
    FROM book b
    LEFT JOIN genre g ON b.genre_id = g.id
    WHERE b.id = $1
  `, [id]);
  return result.rows[0] || null;
};

export const searchBooksByTitle = async (title: string): Promise<Book[]> => {
  const result = await db.query(
    `
    SELECT b.*, g.name AS genre_name
    FROM book b
    LEFT JOIN genre g ON b.genre_id = g.id
    WHERE b.title ILIKE $1
    LIMIT 10
    `,
    [`%${title}%`]
  );
  return result.rows;
};