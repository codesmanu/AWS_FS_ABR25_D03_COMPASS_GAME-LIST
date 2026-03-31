import type { GameView, CreateGameInput, UpdateGame, GameQueryFilters } from './game.types';
import Repository from './game.repository';
import Database from '@/shared/database';

const findAll = async (ownerId: string, filters?: GameQueryFilters): Promise<GameView[]> => {
    return Repository.findAll(ownerId, filters);
};

const findById = async (id: string, ownerId: string): Promise<GameView | null> => {
    return Repository.findById(id, ownerId);
};

const create = async (ownerId: string, input: CreateGameInput): Promise<GameView> => {
    if (!input.title || !input.acquisitionDate || !input.status) {
        throw new Error('GAME_REQUIRED_FIELDS_MISSING');
    }

    if (input.categoryId) {
        const category = await Database.category.findUnique({ where: { id: input.categoryId } });
        if (!category || category.accountId !== ownerId || category.deletedAt) {
            throw new Error('CATEGORY_NOT_FOUND');
        }
    }

    if (input.platformId) {
        const platform = await Database.platform.findUnique({ where: { id: input.platformId } });
        if (!platform || platform.accountId !== ownerId || platform.deletedAt) {
            throw new Error('PLATFORM_NOT_FOUND');
        }
    }

    return Repository.create(input, ownerId);
};

const update = async (id: string, ownerId: string, input: UpdateGame): Promise<GameView> => {
    const existing = await Repository.findById(id, ownerId);
    if (!existing) throw new Error('GAME_NOT_FOUND');

    if (input.categoryId) {
        const category = await Database.category.findUnique({ where: { id: input.categoryId } });
        if (!category || category.accountId !== ownerId || category.deletedAt) {
            throw new Error('CATEGORY_NOT_FOUND');
        }
    }

    if (input.platformId) {
        const platform = await Database.platform.findUnique({ where: { id: input.platformId } });
        if (!platform || platform.accountId !== ownerId || platform.deletedAt) {
            throw new Error('PLATFORM_NOT_FOUND');
        }
    }

    const updated = await Repository.updateById(id, ownerId, input);
    if (!updated) throw new Error('GAME_NOT_FOUND');

    return updated;
};

const remove = async (id: string, ownerId: string): Promise<{ id: string; deleted: boolean }> => {
    const existing = await Repository.findById(id, ownerId);
    if (!existing) throw new Error('GAME_NOT_FOUND');

    const deleted = await Repository.deleteById(id, ownerId);
    if (!deleted) throw new Error('GAME_NOT_FOUND');

    return { id, deleted: true };
};

export default {
    findAll,
    findById,
    create,
    update,
    remove,
};
