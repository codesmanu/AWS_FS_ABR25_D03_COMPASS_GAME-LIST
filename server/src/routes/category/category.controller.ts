import type { Request, Response } from 'express';
import CategoryServices from './category.services';

const list = async (req: Request, res: Response) => {
    const ownerId = req.ownerID;

    const categories = await CategoryServices.findAll(ownerId);

    return res.status(200).json(categories);
};

const get = async (req: Request, res: Response) => {
    const ownerId = req.ownerID;
    const id = req.params.id as string;

    const category = await CategoryServices.findById(id, ownerId);
    if (!category) {
        return res.status(404).json({ message: 'CATEGORY_NOT_FOUND' });
    }

    return res.status(200).json(category);
};

const create = async (req: Request, res: Response) => {
    const ownerId = req.ownerID;
    const input = req.body;

    const category = await CategoryServices.create(ownerId, input);

    return res.status(201).json(category);
};

const update = async (req: Request, res: Response) => {
    const ownerId = req.ownerID;
    const id = req.params.id as string;

    const input = req.body;
    const category = await CategoryServices.update(id, ownerId, input);

    return res.status(200).json(category);
};

const remove = async (req: Request, res: Response) => {
    const ownerId = req.ownerID;
    const id = req.params.id as string;

    const result = await CategoryServices.remove(id, ownerId);

    return res.status(200).json(result);
};

export default {
    list,
    get,
    create,
    update,
    remove,
};