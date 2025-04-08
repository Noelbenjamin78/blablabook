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