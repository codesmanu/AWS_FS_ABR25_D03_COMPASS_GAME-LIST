import type { CategoryEntity, CategoryView, CreateCategoryInput, UpdateCategory } from './category.types';
import Database from '@/shared/database';

const toView = (category: CategoryEntity): CategoryView => ({
    id: category.id,
    name: category.name,
    description: category.description,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
});

const findAll = async (ownerId: string): Promise<CategoryView[]> => {
    const categories = await Database.category.findMany({
        where: { deletedAt: null, accountId: ownerId },
        orderBy: { name: 'asc' },
    });
    return categories.map(toView);
};

const findById = async (id: string, ownerId: string): Promise<CategoryView | null> => {
    const category = await Database.category.findUnique({ where: { id } });
    if (!category || category.deletedAt || category.accountId !== ownerId) return null;
    return toView(category);
};

const create = async (categoryData: CreateCategoryInput, ownerId: string): Promise<CategoryView> => {
    const category = await Database.category.create({
        data: {
            ...categoryData,
            accountId: ownerId,
        },
    });
    return toView(category);
};

const updateById = async (id: string, ownerId: string, categoryData: UpdateCategory): Promise<CategoryView | null> => {
    const category = await Database.category.findUnique({ where: { id } });
    if (!category || category.deletedAt || category.accountId !== ownerId) return null;

    const updated = await Database.category.update({
        where: { id },
        data: categoryData,
    });

    return toView(updated);
};

const deleteById = async (id: string, ownerId: string): Promise<CategoryView | null> => {
    const category = await Database.category.findUnique({ where: { id } });
    if (!category || category.deletedAt || category.accountId !== ownerId) return null;

    const deleted = await Database.category.update({
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
