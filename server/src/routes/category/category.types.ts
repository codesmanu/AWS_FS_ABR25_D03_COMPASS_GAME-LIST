import { Category } from '@prisma/client';

export type CategoryEntity = Category;
export type CategoryView = Omit<Category, 'deletedAt' | 'accountId'>;
export type CreateCategoryInput = Pick<Category, 'name' | 'description'>;
export type UpdateCategory = Partial<Pick<Category, 'name' | 'description'>>;