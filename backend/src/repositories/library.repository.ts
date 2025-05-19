import db from '../db';
import { NewLibraryEntry, LibraryEntry } from '../types/library';

export const addToLibrary = async (entry: NewLibraryEntry): Promise<LibraryEntry> => {
  const { user_id, book_id, status } = entry;

  // Check if the book is already in the user's library
  const existingEntry = await db.query(
    `
    SELECT * FROM library 
    WHERE user_id = $1 AND book_id = $2
    `,
    [user_id, book_id]
  );

  if (existingEntry.rows.length > 0) {
    const currentStatus = existingEntry.rows[0].status;
    const newStatus = currentStatus === 1 ? 0 : 1; 

    const updateResult = await db.query(
      `
      UPDATE library
      SET status = $1
      WHERE user_id = $2 AND book_id = $3
      RETURNING *
      `,
      [newStatus, user_id, book_id]
    );

    return updateResult.rows[0];
  } else {
    const insertResult = await db.query(
      `
      INSERT INTO library (user_id, book_id, status)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [user_id, book_id, status]
    );

    return insertResult.rows[0];
  }
};


export const removeFromLibrary = async (bookId: number, userId:number): Promise<boolean> => {
  const result = await db.query(
    `DELETE FROM library 
    WHERE book_id = $1 AND
    user_id = $2`,
    [bookId, userId]
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

export const getLibraryByUserId = async (userId: number) => {
    const sql = 'SELECT * FROM library WHERE user_id = $1';
    const values = [userId];
    const result = await db.query(sql, values);
    return result.rows;
};