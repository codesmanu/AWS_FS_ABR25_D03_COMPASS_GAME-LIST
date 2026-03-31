import type { Request, Response } from 'express';
import PlatformServices from './platform.services';

const list = async (req: Request, res: Response) => {
    const ownerId = req.ownerID;
    const platforms = await PlatformServices.findAll(ownerId);
    return res.status(200).json(platforms);
};

const get = async (req: Request, res: Response) => {
    const ownerId = req.ownerID;
    const id = req.params.id as string;
    const platform = await PlatformServices.findById(id, ownerId);
    if (!platform) {
        return res.status(404).json({ message: 'PLATFORM_NOT_FOUND' });
    }
    return res.status(200).json(platform);
};

const create = async (req: Request, res: Response) => {
    const ownerId = req.ownerID;
    const input = req.body;
    const created = await PlatformServices.create(ownerId, input);
    return res.status(201).json(created);
};

const update = async (req: Request, res: Response) => {
    const ownerId = req.ownerID;
    const id = req.params.id as string;
    const input = req.body;
    const updated = await PlatformServices.update(id, ownerId, input);
    return res.status(200).json(updated);
};

const remove = async (req: Request, res: Response) => {
    const ownerId = req.ownerID;
    const id = req.params.id as string;
    const result = await PlatformServices.remove(id, ownerId);
    return res.status(200).json(result);
};

export default {
    list,
    get,
    create,
    update,
    remove,
};