import type { GameEntity, GameView, CreateGameInput, UpdateGame, GameQueryFilters } from './game.types';
import Database from '@/shared/database';

const normalizeDate = (value: string | Date | null | undefined): Date | null | undefined => {
    if (value === null || value === undefined) return null;
    if (value instanceof Date) {
        if (Number.isNaN(value.valueOf())) throw new Error('INVALID_DATE_FORMAT');
        return value;
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.valueOf())) throw new Error('INVALID_DATE_FORMAT');
    return parsed;
};

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
    const dataToCreate = {
        ...gameData,
        acquisitionDate: normalizeDate(gameData.acquisitionDate) as Date,
        finishDate:
            gameData.finishDate === null
                ? null
                : normalizeDate(gameData.finishDate),
        accountId: ownerId,
    };

    const created = await Database.game.create({
        data: dataToCreate,
    });
    return toView(created);
};

const updateById = async (id: string, ownerId: string, gameData: UpdateGame): Promise<GameView | null> => {
    const game = await Database.game.findUnique({ where: { id } });
    if (!game || game.deletedAt || game.accountId !== ownerId) return null;

    const dataToUpdate: any = { ...gameData };

    if (gameData.acquisitionDate !== undefined) {
        dataToUpdate.acquisitionDate = normalizeDate(gameData.acquisitionDate);
    }

    if (gameData.finishDate !== undefined) {
        dataToUpdate.finishDate =
            gameData.finishDate === null
                ? null
                : normalizeDate(gameData.finishDate);
    }

    const updated = await Database.game.update({
        where: { id },
        data: dataToUpdate,
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