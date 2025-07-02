import { Router } from 'express';
import { jwtAuthMiddleware } from '../middlewares/jwtAuthMiddleware.js';

import {
  listCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';

const router = Router();

router.get('/', listCategories);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.get('/:categoryId', getCategoryById as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.post('/', jwtAuthMiddleware as any, createCategory as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.put('/:categoryId', jwtAuthMiddleware as any, updateCategory as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.delete('/:categoryId', jwtAuthMiddleware as any, deleteCategory as any);

export default router;
