import bcrypt from 'bcrypt';
import { pool } from '../config/db';
import { signToken, Role } from '../utils/jwt';

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

interface LoginResult {
  token: string;
  user: {
    id: string;
    email: string;
    role: Role;
    profile: Record<string, unknown>;
  };
}

export async function loginWithRole(email: string, password: string, role: Role): Promise<LoginResult> {
  const userResult = await pool.query(
    `SELECT id, email, password_hash, role, is_active FROM users WHERE email = $1`,
    [email.toLowerCase().trim()]
  );

  const user = userResult.rows[0];
  if (!user) {
    throw new AuthError('Invalid email or password.');
  }
  if (!user.is_active) {
    throw new AuthError('This account has been deactivated. Contact your warden.', 403);
  }
  if (user.role !== role) {
    // Deliberately generic message — do not reveal that the email belongs to the other role.
    throw new AuthError('Invalid email or password.');
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    throw new AuthError('Invalid email or password.');
  }

  let profile: Record<string, unknown>;
  let profileId: string;

  if (role === 'student') {
    const studentResult = await pool.query(
      `SELECT s.id, s.student_code, s.full_name, s.course, s.department, s.year,
              s.room_id, s.bed_number, r.block, r.room_number
       FROM students s
       LEFT JOIN rooms r ON r.id = s.room_id
       WHERE s.user_id = $1`,
      [user.id]
    );
    if (!studentResult.rows[0]) {
      throw new AuthError('Student profile not found. Contact your warden.', 404);
    }
    profile = studentResult.rows[0];
    profileId = studentResult.rows[0].id;
  } else {
    const wardenResult = await pool.query(
      `SELECT id, full_name, designation, phone FROM wardens WHERE user_id = $1`,
      [user.id]
    );
    if (!wardenResult.rows[0]) {
      throw new AuthError('Warden profile not found.', 404);
    }
    profile = wardenResult.rows[0];
    profileId = wardenResult.rows[0].id;
  }

  const token = signToken({ userId: user.id, role: user.role, profileId });

  await pool.query(
    `INSERT INTO audit_logs (user_id, action, related_record) VALUES ($1, $2, $3)`,
    [user.id, `${role}_login`, user.email]
  );

  return {
    token,
    user: { id: user.id, email: user.email, role: user.role, profile },
  };
}
