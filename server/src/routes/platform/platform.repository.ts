import type { PlatformEntity, PlatformView, CreatePlatformInput, UpdatePlatform } from './platform.types';
import Database from '@/shared/database';

const toView = (platform: PlatformEntity): PlatformView => ({
    id: platform.id,
    name: platform.name,
    company: platform.company,
    acquisitionYear: platform.acquisitionYear,
    imageUrl: platform.imageUrl,
    createdAt: platform.createdAt,
    updatedAt: platform.updatedAt,
});

const findAll = async (ownerId: string): Promise<PlatformView[]> => {
    const platforms = await Database.platform.findMany({
        where: { deletedAt: null, accountId: ownerId },
        orderBy: { name: 'asc' },
    });
    return platforms.map(toView);
};

const findById = async (id: string, ownerId: string): Promise<PlatformView | null> => {
    const platform = await Database.platform.findUnique({ where: { id } });
    if (!platform || platform.deletedAt || platform.accountId !== ownerId) return null;
    return toView(platform);
};

const create = async (data: CreatePlatformInput, ownerId: string): Promise<PlatformView> => {
    const platform = await Database.platform.create({
        data: {
            ...data,
            accountId: ownerId,
        },
    });
    return toView(platform);
};

const updateById = async (id: string, ownerId: string, data: UpdatePlatform): Promise<PlatformView | null> => {
    const platform = await Database.platform.findUnique({ where: { id } });
    if (!platform || platform.deletedAt || platform.accountId !== ownerId) return null;

    const updated = await Database.platform.update({
        where: { id },
        data,
    });
    return toView(updated);
};

const deleteById = async (id: string, ownerId: string): Promise<PlatformView | null> => {
    const platform = await Database.platform.findUnique({ where: { id } });
    if (!platform || platform.deletedAt || platform.accountId !== ownerId) return null;

    const deleted = await Database.platform.update({
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
