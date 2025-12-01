import { Model } from 'mongoose';
import { UserDocument } from '../schemas/user.schema';
export declare class ProgressService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    completeLesson(userId: string, moduleId: string, lessonNumber: number): Promise<{
        success: boolean;
        message: string;
        completedLessons: number;
    }>;
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
