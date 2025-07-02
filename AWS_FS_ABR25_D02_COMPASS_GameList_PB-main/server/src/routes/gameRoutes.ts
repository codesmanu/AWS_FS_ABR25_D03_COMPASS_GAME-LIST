import { Router } from 'express';
import { jwtAuthMiddleware } from '../middlewares/jwtAuthMiddleware.js';

import {
  listGames,
  createGame,
  getGameById,
  updateGame,
  deleteGame,
} from '../controllers/gameController.js';

const router = Router();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.get('/', listGames as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.get('/:gameId', getGameById as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.post('/', jwtAuthMiddleware as any, createGame as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.put('/:gameId', jwtAuthMiddleware as any, updateGame as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.delete('/:gameId', jwtAuthMiddleware as any, deleteGame as any);

export default router;
