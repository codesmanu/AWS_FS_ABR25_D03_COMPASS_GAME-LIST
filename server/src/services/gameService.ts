import { prisma } from '../server.js';
import type { Game, GameStatus, Prisma } from '@prisma/client';

interface GameCreateData {
  title: string;
  description?: string;
  imageUrl?: string;
  acquisitionDate: Date | string;
  finishDate?: Date | string | null;
  status: GameStatus;
  isFavorite?: boolean;
  categoryId: string;
  platformId?: string;
}

interface GameUpdateData {
  title?: string;
  description?: string;
  imageUrl?: string;
  acquisitionDate?: Date | string;
  finishDate?: Date | string | null;
  status?: GameStatus;
  isFavorite?: boolean;
  categoryId?: string;
  platformId?: string;
}

interface GameQueryFilters {
  categoryId?: string;
  platformId?: string;
  isFavorite?: string;
  search?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export async function findAllGames(
  userId: string,
  filters: GameQueryFilters,
): Promise<{
  games: Game[];
  totalGames: number;
  totalPages: number;
  currentPage: number;
}> {
  const {
    categoryId,
    platformId,
    isFavorite,
    search,
    page = '1',
    limit = '10',
    sortBy = 'createdAt',
    order = 'desc',
  } = filters;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const where: Prisma.GameWhereInput = {
    userId,
    isDeleted: false,
  };

  if (categoryId) {
    where.categoryId = categoryId;
  }
  if (platformId) {
    where.platformId = platformId;
  }
  if (isFavorite !== undefined) {
    where.isFavorite = isFavorite === 'true';
  }
  if (search) {
    const titleFilter: Prisma.StringFilter = {
      contains: search,
      mode: 'insensitive',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    const descriptionFilter: Prisma.StringNullableFilter = {
      contains: search,
      mode: 'insensitive',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    where.OR = [{ title: titleFilter }, { description: descriptionFilter }];
  }

  const validSortByFields: (keyof Game)[] = [
    'title',
    'createdAt',
    'updatedAt',
    'status',
    'acquisitionDate',
    'finishDate',
  ];
  const orderByField = validSortByFields.includes(sortBy as keyof Game)
    ? sortBy
    : 'createdAt';

  const games = await prisma.game.findMany({
    where,
    include: {
      category: true,
      platform: true,
    },
    orderBy: {
      [orderByField]: order,
    },
    skip: skip,
    take: limitNum,
  });

  const totalGames = await prisma.game.count({ where });
  const totalPages = Math.ceil(totalGames / limitNum);

  return { games, totalGames, totalPages, currentPage: pageNum };
}

export async function findGameById(
  gameId: string,
  userId: string,
): Promise<Game | null> {
  return prisma.game.findFirst({
    where: { id: gameId, userId, isDeleted: false },
    include: {
      category: true,
      platform: true,
    },
  });
}

export async function createGame(
  data: GameCreateData,
  userId: string,
): Promise<Game> {
  return prisma.game.create({
    data: {
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      acquisitionDate: new Date(data.acquisitionDate),
      finishDate: data.finishDate ? new Date(data.finishDate) : null,
      status: data.status,
      isFavorite: data.isFavorite,
      userId: userId,
      categoryId: data.categoryId,
      platformId: data.platformId,
    },
  });
}

export async function updateGame(
  gameId: string,
  data: GameUpdateData,
  userId: string,
): Promise<Game | null> {
  const gameToUpdate = await prisma.game.findFirst({
    where: { id: gameId, userId, isDeleted: false },
  });

  if (!gameToUpdate) {
    return null;
  }

  return prisma.game.update({
    where: { id: gameId },
    data: {
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      acquisitionDate: data.acquisitionDate
        ? new Date(data.acquisitionDate)
        : undefined,
      finishDate:
        data.finishDate === null
          ? null
          : data.finishDate
            ? new Date(data.finishDate)
            : undefined,
      status: data.status,
      isFavorite: data.isFavorite,
      categoryId: data.categoryId,
      platformId: data.platformId,
    },
  });
}

export async function removeGame(
  gameId: string,
  userId: string,
): Promise<Game | null> {
  const gameToDelete = await prisma.game.findFirst({
    where: { id: gameId, userId, isDeleted: false },
  });

  if (!gameToDelete) {
    return null;
  }

  return prisma.game.update({
    where: { id: gameId },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
}

export async function countUserGames(userId: string): Promise<number> {
  return prisma.game.count({
    where: { userId, isDeleted: false },
  });
}

export async function countUserFavoriteGames(userId: string): Promise<number> {
  return prisma.game.count({
    where: { userId, isFavorite: true, isDeleted: false },
  });
}
