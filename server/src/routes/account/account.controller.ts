import type { Request, Response } from 'express';
import AccountServices from '@/routes/account/account.services';

const verify = (req: Request, res: Response) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Token is required' });
    }

    AccountServices.check(token);

    return res.status(200).json({ message: 'Token is valid' });
};

const create = async (req: Request, res: Response) => {
    const input = req.body;
    const account = await AccountServices.create(input);

    return res.status(201).json(account);
};

const login = async (req: Request, res: Response) => {
    const input = req.body;
    const data = await AccountServices.login(input);

    return res.status(200).json(data);
};

const update = async (req: Request, res: Response) => {
    const id = req.ownerID;
    const input = req.body;

    const account = await AccountServices.update(id, input);

    return res.status(200).json(account);
};

const remove = async (req: Request, res: Response) => {
    const id = req.ownerID;

    const data = await AccountServices.remove(id);

    return res.status(200).json(data);
};

const refresh = async (req: Request, res: Response) => {
    const id = req.ownerID;

    const data = await AccountServices.refresh(id);

    return res.status(200).json(data);
};

const activate = async (req: Request, res: Response) => {
    const id = req.ownerID;

    const account = await AccountServices.activate(id);

    return res.status(200).json(account);
};

export default {
    verify,
    login,
    create,
    update,
    remove,
    activate,
    refresh,
};