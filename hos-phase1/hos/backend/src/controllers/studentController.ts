import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/db';
import { ok, fail } from '../utils/apiResponse';

export async function getMyProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await pool.query(
      `SELECT s.id, s.student_code, s.full_name, u.email, s.phone, s.date_of_birth, s.gender,
              s.course, s.department, s.year, s.address, s.guardian_name, s.guardian_phone,
              s.emergency_contact, s.room_id, s.bed_number, r.block, r.room_number, r.capacity
       FROM students s
       JOIN users u ON u.id = s.user_id
       LEFT JOIN rooms r ON r.id = s.room_id
       WHERE s.id = $1`,
      [req.auth!.profileId]
    );
    if (!result.rows[0]) return fail(res, 'Student profile not found.', 404);
    return ok(res, result.rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function getMyDashboard(req: Request, res: Response, next: NextFunction) {
  try {
    const student = await pool.query(
      `SELECT s.id, s.full_name, s.student_code, s.course, s.year, r.block, r.room_number
       FROM students s LEFT JOIN rooms r ON r.id = s.room_id
       WHERE s.id = $1`,
      [req.auth!.profileId]
    );
    if (!student.rows[0]) return fail(res, 'Student profile not found.', 404);

    // Phase 1: complaints/leaves/fees tables don't exist yet, so these are placeholders
    // that will be wired to real counts starting Phase 3/4.
    return ok(res, {
      student: student.rows[0],
      stats: {
        pendingComplaints: 0,
        pendingLeaves: 0,
        pendingGatePasses: 0,
        feeStatus: 'not_configured',
      },
    });
  } catch (err) {
    next(err);
  }
}
