import type { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import jwt from 'jsonwebtoken';

export default (error: unknown, req: Request, res: Response, next: NextFunction) => {

    if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: 'TOKEN_EXPIRED', error: error.message });
    }

    if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: 'INVALID_TOKEN', error: error.message });
    }

    if (error instanceof SyntaxError) {
        return res.status(400).json({ message: 'INVALID_JSON', error: error.message });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const prismaErrorCode = error.code;

        if (prismaErrorCode === 'P2025') {
            return res.status(404).json({ message: 'NOT_FOUND', error: error.message });
        }

        if (prismaErrorCode === 'P2025' || prismaErrorCode === 'P2002') {
            return res.status(409).json({ message: 'CONFLICT', error: error.message });
        }

        return res.status(500).json({ message: 'PRISMA_ERROR', error: error.message });
    }

    if (error instanceof Error) {
        const message = error.message;

        const knownErrors: Record<string, { status: number; code: string }> = {
            CATEGORY_NOT_FOUND: { status: 404, code: 'CATEGORY_NOT_FOUND' },
            ACCOUNT_NOT_FOUND: { status: 404, code: 'ACCOUNT_NOT_FOUND' },
            NO_UPDATES_PROVIDED: { status: 400, code: 'NO_UPDATES_PROVIDED' },
            LOGIN_ALREADY_EXISTS: { status: 409, code: 'LOGIN_ALREADY_EXISTS' },
            ACCOUNT_CREATION_FAILED: { status: 500, code: 'ACCOUNT_CREATION_FAILED' },
            INVALID_CREDENTIALS: { status: 401, code: 'INVALID_CREDENTIALS' },
            'A category with this name already exists.': { status: 409, code: 'CATEGORY_ALREADY_EXISTS' },
            'Another category with this name already exists.': { status: 409, code: 'CATEGORY_NAME_DUPLICATE' },
        };

        const mapped = knownErrors[message];
        if (mapped) {
            return res.status(mapped.status).json({ message: mapped.code, error: message });
        }

        return res.status(400).json({ message: 'BAD_REQUEST', error: message });
    }

    return res.status(500).json({ message: 'INTERNAL_SERVER_ERROR' });
};