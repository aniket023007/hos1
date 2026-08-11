import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { getMyProfile, getMyDashboard } from '../controllers/studentController';

const router = Router();

router.use(authenticate, requireRole('student'));

router.get('/profile', getMyProfile);
router.get('/dashboard', getMyDashboard);

export default router;
