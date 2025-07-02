import { Request, Response, NextFunction } from 'express';
import {
  findAllPlatforms as findAllPlatformsService,
  findPlatformById as findPlatformByIdService,
  createPlatform as createPlatformService,
  updatePlatform as updatePlatformService,
  removePlatform as removePlatformService,
} from '../services/platformService.js';

interface PlatformPayload {
  name: string;
  company?: string;
  acquisitionYear?: number;
  imageUrl?: string;
}

export const listPlatforms = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const platforms = await findAllPlatformsService();
    res.status(200).json(platforms);
  } catch (error) {
    next(error);
  }
};

export const createPlatform = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const platformData = req.body as PlatformPayload;
    if (!platformData.name) {
      return res.status(400).json({ message: 'Platform name is required.' });
    }
    const newPlatform = await createPlatformService(platformData);
    res.status(201).json(newPlatform);
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      return res.status(409).json({ message: error.message });
    }
    next(error);
  }
};

export const getPlatformById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { platformId } = req.params;
    const platform = await findPlatformByIdService(platformId);
    if (!platform) {
      return res.status(404).json({ message: 'Platform not found.' });
    }
    res.status(200).json(platform);
  } catch (error) {
    next(error);
  }
};

export const updatePlatform = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { platformId } = req.params;
    const platformData = req.body as Partial<PlatformPayload>;
    const updatedPlatform = await updatePlatformService(
      platformId,
      platformData,
    );
    if (!updatedPlatform) {
      return res.status(404).json({ message: 'Platform not found.' });
    }
    res.status(200).json(updatedPlatform);
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      return res.status(409).json({ message: error.message });
    }
    next(error);
  }
};

export const deletePlatform = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { platformId } = req.params;
    const deletedPlatform = await removePlatformService(platformId);
    if (!deletedPlatform) {
      return res.status(404).json({ message: 'Platform not found.' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
