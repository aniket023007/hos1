import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Copy .env.example to .env and configure it.');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  // Unexpected errors on idle clients — log and let the process supervisor restart if needed.
  console.error('Unexpected PostgreSQL pool error:', err);
});
