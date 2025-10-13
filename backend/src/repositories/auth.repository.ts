import db from "../db";
import { User, UserWithPassword } from "../types/user";

// --- existants ---
export const findUserByEmailOrUsername = async (email: string, username: string): Promise<User | undefined> => {
  const result = await db.query(
    'SELECT id, username, email, created_at FROM "user" WHERE email = $1 OR username = $2',
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

export const findUserByEmail = async (email: string): Promise<UserWithPassword | undefined> => {
  const result = await db.query(
    'SELECT id, username, email, password, reset_token_hash, reset_token_expires_at FROM "user" WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

// --- nouveaux: reset password ---

/** Sauvegarde le hash du token + expiration pour un user */
export async function saveResetTokenForUser(
  userId: number,
  tokenHash: string,
  expiresAt: Date
): Promise<void> {
  await db.query(
    `UPDATE "user"
       SET reset_token_hash = $1,
           reset_token_expires_at = $2
     WHERE id = $3`,
    [tokenHash, expiresAt, userId]
  );
}

/** Retrouve l'utilisateur par email + tokenHash (et renvoie les colonnes utiles) */
export async function findUserByResetToken(
  email: string,
  tokenHash: string
): Promise<UserWithPassword | undefined> {
  const result = await db.query(
    `SELECT id, username, email, password, reset_token_hash, reset_token_expires_at
       FROM "user"
      WHERE email = $1
        AND reset_token_hash = $2
      LIMIT 1`,
    [email, tokenHash]
  );
  return result.rows[0];
}

/** Efface le token (après usage ou expiration) */
export async function clearResetTokenForUser(userId: number): Promise<void> {
  await db.query(
    `UPDATE "user"
        SET reset_token_hash = NULL,
            reset_token_expires_at = NULL
      WHERE id = $1`,
    [userId]
  );
}

/** Met à jour le mot de passe (hashé) */
export async function updateUserPassword(userId: number, newHash: string): Promise<void> {
  await db.query(
    `UPDATE "user"
        SET password = $1
      WHERE id = $2`,
    [newHash, userId]
  );
}

// --- nouveaux: historique des 3 derniers mdp ---

/** Ajoute l'ancien hash dans l'historique puis garde seulement les 3 plus récents */
export async function addPasswordToHistory(userId: number, hash: string): Promise<void> {
  await db.query(
    `INSERT INTO password_history (user_id, password_hash)
     VALUES ($1, $2)`,
    [userId, hash]
  );

  // Garde uniquement les 3 plus récents
  await db.query(
    `DELETE FROM password_history
      WHERE user_id = $1
        AND id NOT IN (
          SELECT id FROM password_history
           WHERE user_id = $1
           ORDER BY created_at DESC
           LIMIT 3
        )`,
    [userId]
  );
}

/** Récupère les N derniers hashes du user (sans le current si tu ne l’ajoutes pas) */
export async function getLastPasswordHashes(userId: number, limit: number): Promise<string[]> {
  const result = await db.query(
    `SELECT password_hash
       FROM password_history
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2`,
    [userId, limit]
  );
  return result.rows.map((r: any) => r.password_hash as string);
}
