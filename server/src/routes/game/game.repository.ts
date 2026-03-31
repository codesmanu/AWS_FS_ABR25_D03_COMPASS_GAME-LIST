import type { GameEntity, GameView, CreateGameInput, UpdateGame, GameQueryFilters } from './game.types';
import Database from '@/shared/database';

const toView = (game: GameEntity): GameView => ({
    id: game.id,
    title: game.title,
    description: game.description,
    imageUrl: game.imageUrl,
    acquisitionDate: game.acquisitionDate,
    finishDate: game.finishDate,
    status: game.status,
    isFavorite: game.isFavorite,
    categoryId: game.categoryId,
    platformId: game.platformId,
    createdAt: game.createdAt,
    updatedAt: game.updatedAt,
});

const findAll = async (ownerId: string, filters?: GameQueryFilters): Promise<GameView[]> => {
    const where: any = {
        accountId: ownerId,
        deletedAt: null,
    };

    if (filters?.categoryId) where.categoryId = filters.categoryId;
    if (filters?.platformId) where.platformId = filters.platformId;
    if (filters?.isFavorite !== undefined) where.isFavorite = filters.isFavorite;

    const games = await Database.game.findMany({
        where,
        include: {
            category: true,
            platform: true,
        },
        orderBy: { createdAt: 'desc' },
    });

    return games.map(toView);
};

const findById = async (id: string, ownerId: string): Promise<GameView | null> => {
    const game = await Database.game.findUnique({ where: { id } });
    if (!game || game.deletedAt || game.accountId !== ownerId) return null;
    return toView(game);
};

const create = async (gameData: CreateGameInput, ownerId: string): Promise<GameView> => {
    const created = await Database.game.create({
        data: {
            ...gameData,
            accountId: ownerId,
        },
    });
    return toView(created);
};

const updateById = async (id: string, ownerId: string, gameData: UpdateGame): Promise<GameView | null> => {
    const game = await Database.game.findUnique({ where: { id } });
    if (!game || game.deletedAt || game.accountId !== ownerId) return null;

    const updated = await Database.game.update({
        where: { id },
        data: gameData,
    });
    return toView(updated);
};

const deleteById = async (id: string, ownerId: string): Promise<GameView | null> => {
    const game = await Database.game.findUnique({ where: { id } });
    if (!game || game.deletedAt || game.accountId !== ownerId) return null;

    const deleted = await Database.game.update({
        where: { id },
        data: { deletedAt: new Date() },
    });
    return toView(deleted);
};

export default {
    findAll,
    findById,
    create,
    updateById,
    deleteById,
};
