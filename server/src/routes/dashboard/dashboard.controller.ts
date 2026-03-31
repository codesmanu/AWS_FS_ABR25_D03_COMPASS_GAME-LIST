import type { Request, Response } from 'express';
import DashboardServices from './dashboard.services';

const summary = async (req: Request, res: Response) => {
    const ownerId = req.ownerID;
    const data = await DashboardServices.getSummary(ownerId);
    return res.status(200).json(data);
};

export default {
    summary,
};
