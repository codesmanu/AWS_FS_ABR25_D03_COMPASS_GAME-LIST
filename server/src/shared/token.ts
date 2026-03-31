import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

type UserCredential = {
    id: string;
    email: string;
};

const Generate = (user: UserCredential): string => {
    try {
        return jwt.sign(user, JWT_SECRET, { expiresIn: '14d' });
    } catch {
        throw new Error('Error generating token');
    }
};

const Verify = (token: string): UserCredential => {
    try {
        return jwt.verify(token, JWT_SECRET) as UserCredential;
    } catch {
        throw new Error('Invalid or expired token');
    }
};

export default { Generate, Verify };
