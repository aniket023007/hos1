import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload, Role } from '../utils/jwt';
import { fail } from '../utils/apiResponse';

// Extend Express's Request type with our decoded auth payload
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: JwtPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return fail(res, 'Authentication required.', 401);
  }

  const token = header.slice('Bearer '.length);
  try {
    req.auth = verifyToken(token);
    next();
  } catch {
    return fail(res, 'Invalid or expired session. Please log in again.', 401);
  }
}

export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) {
      return fail(res, 'Authentication required.', 401);
    }
    if (!roles.includes(req.auth.role)) {
      return fail(res, 'You do not have permission to access this resource.', 403);
    }
    next();
  };
}
