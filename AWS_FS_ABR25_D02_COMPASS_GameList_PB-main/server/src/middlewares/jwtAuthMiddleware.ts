import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; clerkId?: string };
    }
  }
}

export const jwtAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: No token provided or malformed token.' });
  }

  const token = authHeader.split(' ')[1];

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined.');
    return res
      .status(500)
      .json({ message: 'Internal Server Error: JWT configuration missing.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    if (!decoded.id) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: Invalid token payload.' });
    }

    req.user = { id: decoded.id, clerkId: decoded.clerkId };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Unauthorized: Token expired.' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
    }
    console.error('JWT verification error:', error);
    return res
      .status(401)
      .json({ message: 'Unauthorized: Token verification failed.' });
  }
};
