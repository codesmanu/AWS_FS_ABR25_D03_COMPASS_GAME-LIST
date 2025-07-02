import { Request, Response, NextFunction } from 'express';

import {
  countUserGames,
  countUserFavoriteGames,
} from '../services/gameService.js';
import { countAllCategories } from '../services/categoryService.js';
import { countAllPlatforms } from '../services/platformService.js';

export const getDashboardSummary = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: 'User not authenticated for dashboard summary.' });
    }

    const totalGames = await countUserGames(userId);
    const favoriteGamesCount = await countUserFavoriteGames(userId);
    const totalCategories = await countAllCategories();
    const totalPlatforms = await countAllPlatforms();

    res.status(200).json({
      totalGames,
      totalCategories,
      totalPlatforms,
      favoriteGamesCount,
    });
  } catch (error) {
    next(error);
  }
};
