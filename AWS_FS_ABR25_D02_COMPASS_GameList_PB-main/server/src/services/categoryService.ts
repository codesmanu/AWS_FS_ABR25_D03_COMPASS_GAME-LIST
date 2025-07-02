import { prisma } from '../server.js';
import type { Category } from '@prisma/client';

interface CategoryCreateData {
  name: string;
  description?: string;
}

interface CategoryUpdateData {
  name?: string;
  description?: string;
}

export async function findAllCategories(): Promise<Category[]> {
  return prisma.category.findMany({
    where: { isDeleted: false },
    orderBy: { name: 'asc' },
  });
}

export async function findCategoryById(
  categoryId: string,
): Promise<Category | null> {
  return prisma.category.findFirst({
    where: { id: categoryId, isDeleted: false },
  });
}

export async function createCategory(
  data: CategoryCreateData,
): Promise<Category> {
  const existingCategory = await prisma.category.findFirst({
    where: { name: data.name, isDeleted: false },
  });

  if (existingCategory) {
    throw new Error('A category with this name already exists.');
  }

  return prisma.category.create({
    data: {
      name: data.name,
      description: data.description,
    },
  });
}

export async function updateCategory(
  categoryId: string,
  data: CategoryUpdateData,
): Promise<Category | null> {
  const categoryToUpdate = await prisma.category.findFirst({
    where: { id: categoryId, isDeleted: false },
  });

  if (!categoryToUpdate) {
    return null;
  }

  if (data.name && data.name !== categoryToUpdate.name) {
    const existingCategoryWithNewName = await prisma.category.findFirst({
      where: { name: data.name, isDeleted: false, NOT: { id: categoryId } },
    });
    if (existingCategoryWithNewName) {
      throw new Error('Another category with this name already exists.');
    }
  }

  return prisma.category.update({
    where: { id: categoryId },
    data: {
      name: data.name,
      description: data.description,
    },
  });
}

export async function removeCategory(
  categoryId: string,
): Promise<Category | null> {
  const categoryToDelete = await prisma.category.findFirst({
    where: { id: categoryId, isDeleted: false },
  });

  if (!categoryToDelete) {
    return null;
  }

  return prisma.category.update({
    where: { id: categoryId },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
}

export async function countAllCategories(): Promise<number> {
  return prisma.category.count({
    where: { isDeleted: false },
  });
}
