export interface Game {
    id: string;
    imageUrl?: string;
    title: string;
    description?: string;
    category: string | { id: string; name: string };
    platform?: string | { id: string; name: string };
    acquisitionDate: string;
    finishDate?: string;
    status: string;
    isFavorite: boolean;
    createdAt: string;
    updatedAt: string;
}
