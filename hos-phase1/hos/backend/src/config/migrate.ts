import fs from 'fs';
import path from 'path';
import { pool } from './db';

const SCHEMA_DIR = path.join(__dirname, '../../../database/schema');

export async function runMigrations() {
  const files = fs
    .readdirSync(SCHEMA_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  const client = await pool.connect();
  try {
    for (const file of files) {
      const sql = fs.readFileSync(path.join(SCHEMA_DIR, file), 'utf-8');
      console.log(`Applying migration: ${file}`);
      await client.query(sql);
    }
    console.log('✅ All migrations applied.');
  } finally {
    client.release();
    await pool.end();
  }
}

if (require.main === module) {
  runMigrations().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
}
