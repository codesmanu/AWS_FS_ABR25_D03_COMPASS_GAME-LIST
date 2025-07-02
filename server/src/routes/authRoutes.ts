import { Router } from 'express';

import {
  handleClerkLoginOrRegister,
  getMyProfile,
  logout,
  customRegisterUser,
} from '../controllers/authController.js';

import { jwtAuthMiddleware } from '../middlewares/jwtAuthMiddleware.js';

const router = Router();

const clerkSecretKey = process.env.CLERK_SECRET_KEY;
const clerkPublishableKey = process.env.CLERK_PUBLISHABLE_KEY;

if (!clerkSecretKey) {
  console.warn(
    'CLERK_SECRET_KEY for backend is not set. Clerk features might not work.',
  );
}
if (!clerkPublishableKey) {
  console.warn(
    'CLERK_PUBLISHABLE_KEY is not set. Clerk features might not work.',
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.post('/session', handleClerkLoginOrRegister as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.post('/custom-register', customRegisterUser as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.get('/me', jwtAuthMiddleware as any, getMyProfile as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.post('/logout', jwtAuthMiddleware as any, logout as any);

export default router;
