import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { getDashboardStats, listStudents } from '../controllers/wardenController';

const router = Router();

router.use(authenticate, requireRole('warden'));

router.get('/dashboard', getDashboardStats);
router.get('/students', listStudents);

export default router;
