import { Request, Response, NextFunction } from 'express';
import {
  findAllGames as findAllGamesService,
  findGameById as findGameByIdService,
  createGame as createGameService,
  updateGame as updateGameService,
  removeGame as removeGameService,
} from '../services/gameService.js';
import type { GameStatus } from '@prisma/client';

interface GameCreatePayload {
  title: string;
  description?: string;
  imageUrl?: string;
  acquisitionDate: string | Date;
  finishDate?: string | Date | null;
  status: GameStatus;
  isFavorite?: boolean;
  categoryId: string;
  platformId?: string;
}

interface GameUpdatePayload {
  title?: string;
  description?: string;
  imageUrl?: string;
  acquisitionDate?: string | Date;
  finishDate?: string | Date | null;
  status?: GameStatus;
  isFavorite?: boolean;
  categoryId?: string;
  platformId?: string;
}

export const listGames = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ message: 'User not authenticated for this action.' });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await findAllGamesService(userId, req.query as any);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const createGame = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ message: 'User not authenticated for this action.' });
    }
    const gameData = req.body as GameCreatePayload;
    if (
      !gameData.title ||
      !gameData.categoryId ||
      !gameData.acquisitionDate ||
      !gameData.status
    ) {
      return res.status(400).json({
        message: 'Title, category, acquisition date, and status are required.',
      });
    }
    const newGame = await createGameService(gameData, userId);
    res.status(201).json(newGame);
  } catch (error) {
    next(error);
  }
};

export const getGameById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ message: 'User not authenticated for this action.' });
    }
    const { gameId } = req.params;
    const game = await findGameByIdService(gameId, userId);
    if (!game) {
      return res
        .status(404)
        .json({ message: 'Game not found or access denied.' });
    }
    res.status(200).json(game);
  } catch (error) {
    next(error);
  }
};

export const updateGame = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ message: 'User not authenticated for this action.' });
    }
    const { gameId } = req.params;
    const gameData = req.body as GameUpdatePayload;
    const updatedGame = await updateGameService(gameId, gameData, userId);
    if (!updatedGame) {
      return res
        .status(404)
        .json({ message: 'Game not found or access denied.' });
    }
    res.status(200).json(updatedGame);
  } catch (error) {
    next(error);
  }
};

export const deleteGame = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ message: 'User not authenticated for this action.' });
    }
    const { gameId } = req.params;
    const deletedGame = await removeGameService(gameId, userId);
    if (!deletedGame) {
      return res
        .status(404)
        .json({ message: 'Game not found or access denied.' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
