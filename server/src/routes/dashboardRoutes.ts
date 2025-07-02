import { Router } from 'express';
import { getDashboardSummary } from '../controllers/dashboardController.js';
import { jwtAuthMiddleware } from '../middlewares/jwtAuthMiddleware.js';

const router = Router();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.get('/summary', jwtAuthMiddleware as any, getDashboardSummary as any);

export default router;
