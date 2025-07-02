import { prisma } from '../server.js';
import type { Platform } from '@prisma/client';

interface PlatformCreateData {
  name: string;
  company?: string;
  acquisitionYear?: number;
  imageUrl?: string;
}

interface PlatformUpdateData {
  name?: string;
  company?: string;
  acquisitionYear?: number;
  imageUrl?: string;
}

export async function findAllPlatforms(): Promise<Platform[]> {
  return prisma.platform.findMany({
    where: { isDeleted: false },
    orderBy: { name: 'asc' },
  });
}

export async function findPlatformById(
  platformId: string,
): Promise<Platform | null> {
  return prisma.platform.findFirst({
    where: { id: platformId, isDeleted: false },
  });
}

export async function createPlatform(
  data: PlatformCreateData,
): Promise<Platform> {
  const existingPlatform = await prisma.platform.findFirst({
    where: { name: data.name, isDeleted: false },
  });

  if (existingPlatform) {
    throw new Error('A platform with this name already exists.');
  }

  return prisma.platform.create({
    data: {
      name: data.name,
      company: data.company,
      acquisitionYear: data.acquisitionYear,
      imageUrl: data.imageUrl,
    },
  });
}

export async function updatePlatform(
  platformId: string,
  data: PlatformUpdateData,
): Promise<Platform | null> {
  const platformToUpdate = await prisma.platform.findFirst({
    where: { id: platformId, isDeleted: false },
  });

  if (!platformToUpdate) {
    return null;
  }

  if (data.name && data.name !== platformToUpdate.name) {
    const existingPlatformWithNewName = await prisma.platform.findFirst({
      where: { name: data.name, isDeleted: false, NOT: { id: platformId } },
    });
    if (existingPlatformWithNewName) {
      throw new Error('Another platform with this name already exists.');
    }
  }

  return prisma.platform.update({
    where: { id: platformId },
    data: {
      name: data.name,
      company: data.company,
      acquisitionYear: data.acquisitionYear,
      imageUrl: data.imageUrl,
    },
  });
}

export async function removePlatform(
  platformId: string,
): Promise<Platform | null> {
  const platformToDelete = await prisma.platform.findFirst({
    where: { id: platformId, isDeleted: false },
  });

  if (!platformToDelete) {
    return null;
  }

  return prisma.platform.update({
    where: { id: platformId },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
}

export async function countAllPlatforms(): Promise<number> {
  return prisma.platform.count({
    where: { isDeleted: false },
  });
}
