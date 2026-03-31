import { Request, Response, NextFunction } from 'express';
import Token from '@/shared/token';

declare global {
    namespace Express {
        interface Request {
            ownerID: string;
        }
    }
}

const Guest = (req: Request, _: Response, next: NextFunction): Response | void => {
    const token = req.cookies.token || '';

    if (token) {
        try {
            const decoded = Token.Verify(token);
            req.ownerID = decoded.id;
        } catch {
            req.ownerID = 'Guest';
        }
    }

    return next();
};

const Safe = (req: Request, res: Response, next: NextFunction): Response | void => {
    const token = req.cookies.token || '';

    console.log('Token:', token);

    if (!token) return res.status(401).json({ error: 'Where is the Token?' });

    try {
        const decoded = Token.Verify(token);
        req.ownerID = decoded.id;
        return next();
    } catch {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

export default { Guest, Safe };