import { Model } from 'mongoose';
import { UserDocument } from '../schemas/user.schema';
import { ModuleDocument } from '../schemas/module.schema';
export declare class FavoritesService {
    private userModel;
    private moduleModel;
    constructor(userModel: Model<UserDocument>, moduleModel: Model<ModuleDocument>);
    addToFavorites(userId: string, moduleId: string, lessonNumber: number): Promise<{
        success: boolean;
        lesson: {
            moduleId: string;
            lessonNumber: number;
            isFavorite: boolean;
        };
    }>;
    removeFromFavorites(userId: string, moduleId: string, lessonNumber: number): Promise<{
        success: boolean;
        lesson: {
            moduleId: string;
            lessonNumber: number;
            isFavorite: boolean;
        };
    }>;
    getFavorites(userId: string): Promise<{
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
    isFavorite(userId: string, moduleId: string, lessonNumber: number): Promise<boolean>;
}
