import db from '../db';
import { NewLibraryEntry, LibraryEntry } from '../types/library';

export const addToLibrary = async (entry: NewLibraryEntry): Promise<LibraryEntry> => {
  const { user_id, book_id, status = 0 } = entry;

  const result = await db.query(
    `
    INSERT INTO library (user_id, book_id, status)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [user_id, book_id, status]
  );

  return result.rows[0];
};

export const removeFromLibrary = async (id: number): Promise<boolean> => {
  const result = await db.query(
    `DELETE FROM library WHERE id = $1`,
    [id]
  );
  return (result.rowCount ?? 0) > 0;
};

export const updateLibraryStatus = async (id: number, status: number): Promise<boolean> => {
  const result = await db.query(
    `
    UPDATE library
    SET status = $1
    WHERE id = $2
    `,
    [status, id]
  );

  return (result.rowCount ?? 0) > 0;
};

export const getLibraryByUser = async (userId: number, status?: number): Promise<LibraryEntry[]> => {
  let query = `
    SELECT l.*, b.title, b.author, b.image, b.genre_id, g.name AS genre_name
    FROM library l
    JOIN book b ON l.book_id = b.id
    LEFT JOIN genre g ON b.genre_id = g.id
    WHERE l.user_id = $1
  `;
  const values: (number | string)[] = [userId];

  if (status !== undefined) {
    query += ` AND l.status = $2`;
    values.push(status);
  }

  const result = await db.query(query, values);
  return result.rows;
};