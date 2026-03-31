import type { Request, Response } from 'express';
import GameServices from './game.services';

const list = async (req: Request, res: Response) => {
    const ownerId = req.ownerID;
    const filters = {
        categoryId: req.query.categoryId as string | undefined,
        platformId: req.query.platformId as string | undefined,
        isFavorite: req.query.isFavorite ? req.query.isFavorite === 'true' : undefined,
    };

    const games = await GameServices.findAll(ownerId, filters);
    return res.status(200).json(games);
};

const get = async (req: Request, res: Response) => {
    const ownerId = req.ownerID;
    const id = req.params.id as string;
    const game = await GameServices.findById(id, ownerId);
    if (!game) {
        return res.status(404).json({ message: 'GAME_NOT_FOUND' });
    }
    return res.status(200).json(game);
};

const create = async (req: Request, res: Response) => {
    const ownerId = req.ownerID;
    const input = req.body;
    const game = await GameServices.create(ownerId, input);
    return res.status(201).json(game);
};

const update = async (req: Request, res: Response) => {
    const ownerId = req.ownerID;
    const id = req.params.id as string;
    const input = req.body;
    const game = await GameServices.update(id, ownerId, input);
    return res.status(200).json(game);
};

const remove = async (req: Request, res: Response) => {
    const ownerId = req.ownerID;
    const id = req.params.id as string;
    const result = await GameServices.remove(id, ownerId);
    return res.status(200).json(result);
};

export default {
    list,
    get,
    create,
    update,
    remove,
};
