import { Game, GameStatus } from '@prisma/client';

export type GameEntity = Game;
export type GameView = Omit<Game, 'deletedAt' | 'accountId'>;

export type CreateGameInput = Pick<
    Game,
    | 'title'
    | 'description'
    | 'imageUrl'
    | 'acquisitionDate'
    | 'finishDate'
    | 'status'
    | 'isFavorite'
    | 'categoryId'
    | 'platformId'
>;

export type UpdateGame = Partial<CreateGameInput>;

export type GameQueryFilters = {
    categoryId?: string;
    platformId?: string;
    isFavorite?: boolean;
};
