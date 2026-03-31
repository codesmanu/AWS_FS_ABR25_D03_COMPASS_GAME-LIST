import CategoryRepository from '@/routes/category/category.repository';
import PlatformRepository from '@/routes/platform/platform.repository';
import GameRepository from '@/routes/game/game.repository';

type DashboardSummary = {
    totalGames: number;
    totalCategories: number;
    totalPlatforms: number;
    favoriteGamesCount: number;
};

const getSummary = async (ownerId: string): Promise<DashboardSummary> => {
    const [games, categories, platforms] = await Promise.all([
        GameRepository.findAll(ownerId),
        CategoryRepository.findAll(ownerId),
        PlatformRepository.findAll(ownerId),
    ]);

    const favoriteGamesCount = games.filter((game) => game.isFavorite).length;

    return {
        totalGames: games.length,
        totalCategories: categories.length,
        totalPlatforms: platforms.length,
        favoriteGamesCount,
    };
};

export default {
    getSummary,
};