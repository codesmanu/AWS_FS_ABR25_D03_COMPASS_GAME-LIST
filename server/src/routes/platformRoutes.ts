import { Router } from 'express';
import { jwtAuthMiddleware } from '../middlewares/jwtAuthMiddleware.js';

import {
  listPlatforms,
  createPlatform,
  getPlatformById,
  updatePlatform,
  deletePlatform,
} from '../controllers/platformController.js';

const router = Router();

router.get('/', listPlatforms);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.get('/:platformId', getPlatformById as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.post('/', jwtAuthMiddleware as any, createPlatform as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.put('/:platformId', jwtAuthMiddleware as any, updatePlatform as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.delete('/:platformId', jwtAuthMiddleware as any, deletePlatform as any);

export default router;
