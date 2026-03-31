import type { PlatformView, CreatePlatformInput, UpdatePlatform } from './platform.types';
import Repository from './platform.repository';

const findAll = async (ownerId: string): Promise<PlatformView[]> => {
    return Repository.findAll(ownerId);
};

const findById = async (id: string, ownerId: string): Promise<PlatformView | null> => {
    return Repository.findById(id, ownerId);
};

const create = async (ownerId: string, input: CreatePlatformInput): Promise<PlatformView> => {
    const existing = await Repository.findAll(ownerId);
    if (existing.some((p) => p.name === input.name)) {
        throw new Error('A platform with this name already exists.');
    }
    return Repository.create(input, ownerId);
};

const update = async (id: string, ownerId: string, input: UpdatePlatform): Promise<PlatformView> => {
    const platform = await Repository.findById(id, ownerId);
    if (!platform) throw new Error('PLATFORM_NOT_FOUND');

    if (input.name) {
        const exist = await Repository.findAll(ownerId);
        const conflict = exist.find((item) => item.name === input.name && item.id !== id);
        if (conflict) throw new Error('Another platform with this name already exists.');
    }

    const updated = await Repository.updateById(id, ownerId, input);
    if (!updated) throw new Error('PLATFORM_NOT_FOUND');

    return updated;
};

const remove = async (id: string, ownerId: string): Promise<{ id: string; deleted: boolean }> => {
    const platform = await Repository.findById(id, ownerId);
    if (!platform) throw new Error('PLATFORM_NOT_FOUND');

    const deleted = await Repository.deleteById(id, ownerId);
    if (!deleted) throw new Error('PLATFORM_NOT_FOUND');

    return { id, deleted: true };
};

export default {
    findAll,
    findById,
    create,
    update,
    remove,
};
