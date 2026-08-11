import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { studentLogin, wardenLogin } from '../controllers/authController';

const router = Router();

// Slow down brute-force attempts against login endpoints.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { message: 'Too many login attempts. Try again later.' } },
});

router.post('/student/login', loginLimiter, studentLogin);
router.post('/warden/login', loginLimiter, wardenLogin);

export default router;
