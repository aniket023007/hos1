import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ok, fail } from '../utils/apiResponse';
import { loginWithRole, AuthError } from '../services/authService';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

export async function studentLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return fail(res, 'Invalid input.', 422, parsed.error.flatten());
    }
    const result = await loginWithRole(parsed.data.email, parsed.data.password, 'student');
    return ok(res, result);
  } catch (err) {
    if (err instanceof AuthError) return fail(res, err.message, err.status);
    next(err);
  }
}

export async function wardenLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return fail(res, 'Invalid input.', 422, parsed.error.flatten());
    }
    const result = await loginWithRole(parsed.data.email, parsed.data.password, 'warden');
    return ok(res, result);
  } catch (err) {
    if (err instanceof AuthError) return fail(res, err.message, err.status);
    next(err);
  }
}
