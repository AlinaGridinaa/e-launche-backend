import { CuratorService } from './curator.service';
export declare class CuratorController {
    private readonly curatorService;
    constructor(curatorService: CuratorService);
    getHomeworks(req: any): Promise<{
        id: import("mongoose").Types.ObjectId;
        studentId: string;
        studentName: string;
        moduleId: string;
        moduleTitle: string;
        moduleNumber: number | undefined;
        lessonNumber: number;
        answer: string;
        attachments: string[];
        fileAttachments: string[];
        status: "pending" | "reviewed" | "approved" | "needs_revision";
        score: number | undefined;
        feedback: string | undefined;
        audioFeedback: string | undefined;
        submittedAt: Date;
        reviewedAt: Date | undefined;
    }[]>;
    uploadAudio(file: Express.Multer.File): Promise<{
        audioUrl: string;
    }>;
    reviewHomework(req: any, homeworkId: string, reviewDto: {
        score?: number;
        feedback?: string;
        audioFeedback?: string;
    }): Promise<{
        id: import("mongoose").Types.ObjectId;
        score: number | undefined;
        feedback: string | undefined;
        audioFeedback: string | undefined;
        status: "reviewed";
        reviewedAt: Date;
    }>;
    returnForRevision(req: any, homeworkId: string, returnDto: {
        feedback: string;
        audioFeedback?: string;
    }): Promise<{
        id: import("mongoose").Types.ObjectId;
        feedback: string;
        audioFeedback: string | undefined;
        status: "needs_revision";
        reviewedAt: Date;
    }>;
    getMyStudents(req: any): Promise<{
        id: import("mongoose").Types.ObjectId;
        firstName: string;
        lastName: string | undefined;
        email: string;
        faculty: string | undefined;
        completedLessonsCount: number;
        completedModulesCount: number;
        earnings: number;
    }[]>;
    getAllModules(): Promise<{
        id: import("mongoose").Types.ObjectId;
        number: number;
        title: string;
        description: string;
        lessonsCount: number;
    }[]>;
}
