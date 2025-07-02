import jwt, { Secret, SignOptions, JwtPayload } from 'jsonwebtoken';
import { User } from '@prisma/client';

/**
 * Generates an application JWT token for a user
 * @param user The user object from the database
 * @returns A JWT token string
 */
export function generateAppToken(user: User): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }

  const payload = {
    id: user.id,
    clerkId: user.clerkId,
    email: user.email,
  };

  const secret: Secret = process.env.JWT_SECRET;

  const options: SignOptions = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any,
  };

  return jwt.sign(payload, secret, options);
}

/**
 * Verify and decode a JWT token
 * @param token The JWT token to verify
 * @returns The decoded token payload or null if invalid
 */
export function verifyAppToken(token: string): JwtPayload | null {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }

  try {
    const secret: Secret = process.env.JWT_SECRET;
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}
