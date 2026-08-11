import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/db';
import { ok } from '../utils/apiResponse';

export async function getDashboardStats(req: Request, res: Response, next: NextFunction) {
  try {
    const [studentsCount, roomsCount, occupied] = await Promise.all([
      pool.query(`SELECT COUNT(*)::int AS count FROM students`),
      pool.query(`SELECT COALESCE(SUM(capacity), 0)::int AS total_beds, COUNT(*)::int AS total_rooms FROM rooms`),
      pool.query(`SELECT COUNT(*)::int AS count FROM students WHERE room_id IS NOT NULL`),
    ]);

    const totalBeds = roomsCount.rows[0].total_beds;
    const occupiedBeds = occupied.rows[0].count;

    return ok(res, {
      totalStudents: studentsCount.rows[0].count,
      totalRooms: roomsCount.rows[0].total_rooms,
      totalBeds,
      occupiedBeds,
      availableBeds: totalBeds - occupiedBeds,
      // Placeholders until Phase 3+ modules are implemented:
      pendingComplaints: 0,
      pendingLeaves: 0,
      pendingGatePasses: 0,
      pendingFees: 0,
      activeSosAlerts: 0,
    });
  } catch (err) {
    next(err);
  }
}

export async function listStudents(req: Request, res: Response, next: NextFunction) {
  try {
    const search = (req.query.search as string) || '';
    const result = await pool.query(
      `SELECT s.id, s.student_code, s.full_name, u.email, s.course, s.year, r.block, r.room_number
       FROM students s
       JOIN users u ON u.id = s.user_id
       LEFT JOIN rooms r ON r.id = s.room_id
       WHERE s.full_name ILIKE $1 OR s.student_code ILIKE $1 OR u.email ILIKE $1
       ORDER BY s.full_name
       LIMIT 100`,
      [`%${search}%`]
    );
    return ok(res, result.rows);
  } catch (err) {
    next(err);
  }
}
