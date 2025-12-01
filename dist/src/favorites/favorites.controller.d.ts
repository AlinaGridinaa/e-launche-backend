import { FavoritesService } from './favorites.service';
export declare class FavoritesController {
    private readonly favoritesService;
    constructor(favoritesService: FavoritesService);
    addToFavorites(moduleId: string, lessonNumber: string, req: any): Promise<{
        success: boolean;
        lesson: {
            moduleId: string;
            lessonNumber: number;
            isFavorite: boolean;
        };
    }>;
    removeFromFavorites(moduleId: string, lessonNumber: string, req: any): Promise<{
        success: boolean;
        lesson: {
            moduleId: string;
            lessonNumber: number;
            isFavorite: boolean;
        };
    }>;
    getFavorites(req: any): Promise<{
        favorites: {
            moduleId: any;
            moduleNumber: number;
            moduleTitle: string;
            lessonNumber: number;
            lessonTitle: string;
            videoUrl: string;
            description: string;
            duration: number;
            isCompleted: boolean;
            addedAt: Date;
        }[];
        total: number;
    }>;
    checkIsFavorite(moduleId: string, lessonNumber: string, req: any): Promise<{
        isFavorite: boolean;
    }>;
}
