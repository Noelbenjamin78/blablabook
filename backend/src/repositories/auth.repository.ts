import db from '../db';
import { User } from '../types/user';

export const findUserByEmailOrUsername = async (email: string, username: string): Promise<User | undefined> => {
  const result = await db.query(
    'SELECT * FROM "user" WHERE email = $1 OR username = $2',
    [email, username]
  );
  return result.rows[0];
};

export const createUser = async (username: string, email: string, hashedPassword: string): Promise<User> => {
  const result = await db.query(
    `INSERT INTO "user" (username, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, username, email, created_at`,
    [username, email, hashedPassword]
  );
  return result.rows[0];
};