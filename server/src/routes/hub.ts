import { Router } from "express";

import AccountRouter from '@/routes/account/account.router';
import CategoryRouter from '@/routes/category/category.router';
import PlatformRouter from '@/routes/platform/platform.router';
import GameRouter from '@/routes/game/game.router';
import DashboardRouter from '@/routes/dashboard/dashboard.router';

const router = Router();

router.use('/account', AccountRouter);
router.use('/category', CategoryRouter);
router.use('/platform', PlatformRouter);
router.use('/game', GameRouter);
router.use('/dashboard', DashboardRouter);

export default router;