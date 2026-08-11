import { Request, Response, NextFunction } from 'express';
import { fail } from '../utils/apiResponse';

export function notFoundHandler(req: Request, res: Response) {
  return fail(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  console.error('Unhandled error:', err);
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Something went wrong. Please try again.'
      : err instanceof Error
      ? err.message
      : 'Unknown error';
  return fail(res, message, 500);
}
