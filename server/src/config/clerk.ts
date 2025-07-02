import { createClerkClient } from '@clerk/backend';
import dotenv from 'dotenv';

dotenv.config();

const clerkSecretKey = process.env.CLERK_SECRET_KEY;

if (!clerkSecretKey) {
  throw new Error(
    'CLERK_SECRET_KEY is not defined in the environment variables.',
  );
}

export const clerkClient = createClerkClient({ secretKey: clerkSecretKey });
