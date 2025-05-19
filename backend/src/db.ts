import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// setTimeout to delay the connection attempt, test would fail if the database is not ready
setTimeout(() => {
    pool.connect()
      .then()
      .catch(err => console.error('🔴 PostgreSQL connection error', err));
  }, 5000);

export default pool;