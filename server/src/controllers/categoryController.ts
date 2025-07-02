import { Request, Response, NextFunction } from 'express';
import {
  findAllCategories as findAllCategoriesService,
  findCategoryById as findCategoryByIdService,
  createCategory as createCategoryService,
  updateCategory as updateCategoryService,
  removeCategory as removeCategoryService,
} from '../services/categoryService.js';

interface CategoryPayload {
  name: string;
  description?: string;
}

export const listCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await findAllCategoriesService();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categoryData = req.body as CategoryPayload;
    if (!categoryData.name) {
      return res.status(400).json({ message: 'Category name is required.' });
    }
    const newCategory = await createCategoryService(categoryData);
    res.status(201).json(newCategory);
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      return res.status(409).json({ message: error.message });
    }
    next(error);
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { categoryId } = req.params;
    const category = await findCategoryByIdService(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { categoryId } = req.params;
    const categoryData = req.body as Partial<CategoryPayload>;
    const updatedCategory = await updateCategoryService(
      categoryId,
      categoryData,
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      return res.status(409).json({ message: error.message });
    }
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { categoryId } = req.params;
    const deletedCategory = await removeCategoryService(categoryId);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
