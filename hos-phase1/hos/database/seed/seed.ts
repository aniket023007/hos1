/**
 * Demo seed data for HOS — Phase 1
 * Run with: npm run seed   (from /backend)
 *
 * Creates:
 *  - 1 demo warden
 *  - 3 demo students
 *  - 2 demo rooms
 *
 * DEMO CREDENTIALS (also documented in README.md):
 *   Warden:  warden@demo.hos   / Warden@123
 *   Student: s1@demo.hos       / Student@123
 *   Student: s2@demo.hos       / Student@123
 *   Student: s3@demo.hos       / Student@123
 *
 * No real personal information is used — all names/data are fictional placeholders.
 */
import bcrypt from 'bcrypt';
import { pool } from '../../backend/src/config/db';

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const wardenPasswordHash = await bcrypt.hash('Warden@123', 10);
    const studentPasswordHash = await bcrypt.hash('Student@123', 10);

    // --- Warden ---
    const wardenUser = await client.query(
      `INSERT INTO users (email, password_hash, role)
       VALUES ($1, $2, 'warden')
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
       RETURNING id`,
      ['warden@demo.hos', wardenPasswordHash]
    );
    await client.query(
      `INSERT INTO wardens (user_id, full_name, phone, designation)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT DO NOTHING`,
      [wardenUser.rows[0].id, 'Demo Warden', '9990001111', 'Chief Warden']
    );

    // --- Rooms ---
    const roomA = await client.query(
      `INSERT INTO rooms (block, room_number, floor, capacity)
       VALUES ('A', '101', 1, 4)
       ON CONFLICT (block, room_number) DO UPDATE SET capacity = EXCLUDED.capacity
       RETURNING id`
    );
    const roomB = await client.query(
      `INSERT INTO rooms (block, room_number, floor, capacity)
       VALUES ('B', '204', 2, 3)
       ON CONFLICT (block, room_number) DO UPDATE SET capacity = EXCLUDED.capacity
       RETURNING id`
    );

    // --- Students ---
    const studentsData = [
      { email: 's1@demo.hos', code: 'STU2026001', name: 'Demo Student One', room: roomA.rows[0].id, bed: 1, course: 'B.Tech CSE', year: 2 },
      { email: 's2@demo.hos', code: 'STU2026002', name: 'Demo Student Two', room: roomA.rows[0].id, bed: 2, course: 'B.Tech ECE', year: 1 },
      { email: 's3@demo.hos', code: 'STU2026003', name: 'Demo Student Three', room: roomB.rows[0].id, bed: 1, course: 'B.Sc Physics', year: 3 },
    ];

    for (const s of studentsData) {
      const u = await client.query(
        `INSERT INTO users (email, password_hash, role)
         VALUES ($1, $2, 'student')
         ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
         RETURNING id`,
        [s.email, studentPasswordHash]
      );
      await client.query(
        `INSERT INTO students (user_id, student_code, full_name, course, year, room_id, bed_number)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (student_code) DO NOTHING`,
        [u.rows[0].id, s.code, s.name, s.course, s.year, s.room, s.bed]
      );
    }

    await client.query('COMMIT');
    console.log('✅ Seed complete. Demo credentials:');
    console.log('   Warden:  warden@demo.hos  / Warden@123');
    console.log('   Student: s1@demo.hos      / Student@123');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
