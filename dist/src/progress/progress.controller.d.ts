import { ProgressService } from './progress.service';
export declare class ProgressController {
    private readonly progressService;
    constructor(progressService: ProgressService);
    completeLesson(req: any, moduleId: string, lessonNumber: string, body: {
        moodRating?: number;
        usefulnessRating?: number;
    }): Promise<{
        success: boolean;
        message: string;
        completedLessons: number;
    }>;
    uncompleteLesson(req: any, moduleId: string, lessonNumber: string): Promise<{
        success: boolean;
        message: string;
        completedLessons: number;
    }>;
    completeModule(req: any, moduleId: string): Promise<{
        success: boolean;
        message: string;
        completedModules: number;
        newAvatarLevel: number;
        newAvatarUrl: string | undefined;
    }>;
    getLessonStatus(req: any, moduleId: string, lessonNumber: string): Promise<{
        isCompleted: boolean;
    }>;
}
