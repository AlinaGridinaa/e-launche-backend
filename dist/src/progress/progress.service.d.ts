import { Model } from 'mongoose';
import { UserDocument } from '../schemas/user.schema';
import { ModuleDocument } from '../schemas/module.schema';
export declare class ProgressService {
    private userModel;
    private moduleModel;
    constructor(userModel: Model<UserDocument>, moduleModel: Model<ModuleDocument>);
    completeLesson(userId: string, moduleId: string, lessonNumber: number, moodRating?: number, usefulnessRating?: number): Promise<{
        success: boolean;
        message: string;
        completedLessons: number;
    }>;
    private checkAndCompleteModule;
    uncompleteLesson(userId: string, moduleId: string, lessonNumber: number): Promise<{
        success: boolean;
        message: string;
        completedLessons: number;
    }>;
    completeModule(userId: string, moduleId: string): Promise<{
        success: boolean;
        message: string;
        completedModules: number;
        newAvatarLevel: number;
        newAvatarUrl: string | undefined;
    }>;
    isLessonCompleted(userId: string, moduleId: string, lessonNumber: number): Promise<boolean>;
}
