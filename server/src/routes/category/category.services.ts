import type { CategoryView, CreateCategoryInput, UpdateCategory } from './category.types';
import Repository from './category.repository';

const findAll = async (ownerId: string): Promise<CategoryView[]> => {
    return Repository.findAll(ownerId);
};

const findById = async (id: string, ownerId: string): Promise<CategoryView | null> => {
    return Repository.findById(id, ownerId);
};

const create = async (ownerId: string, input: CreateCategoryInput): Promise<CategoryView> => {
    const existing = await Repository.findAll(ownerId);
    if (existing.some((category) => category.name === input.name)) {
        throw new Error('A category with this name already exists.');
    }

    return Repository.create(input, ownerId);
};
const update = async (id: string, ownerId: string, input: UpdateCategory): Promise<CategoryView> => {
    const category = await Repository.findById(id, ownerId);
    if (!category) throw new Error('CATEGORY_NOT_FOUND');

    if (input.name) {
        const all = await Repository.findAll(ownerId);
        const conflict = all.find((item) => item.name === input.name && item.id !== id);
        if (conflict) throw new Error('Another category with this name already exists.');
    }

    const updated = await Repository.updateById(id, ownerId, input);
    if (!updated) throw new Error('CATEGORY_NOT_FOUND');

    return updated;
};
const remove = async (id: string, ownerId: string): Promise<{ id: string; deleted: boolean }> => {
    const category = await Repository.findById(id, ownerId);
    if (!category) throw new Error('CATEGORY_NOT_FOUND');

    const deleted = await Repository.deleteById(id, ownerId);
    if (!deleted) throw new Error('CATEGORY_NOT_FOUND');

    return { id, deleted: true };
};

export default {
    findAll,
    findById,
    create,
    update,
    remove,
};
