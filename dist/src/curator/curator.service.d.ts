import { Model } from 'mongoose';
import { HomeworkDocument } from '../schemas/homework.schema';
import { UserDocument } from '../schemas/user.schema';
import { ModuleDocument } from '../schemas/module.schema';
import { NotificationsService } from '../notifications/notifications.service';
export declare class CuratorService {
    private homeworkModel;
    private userModel;
    private moduleModel;
    private notificationsService;
    constructor(homeworkModel: Model<HomeworkDocument>, userModel: Model<UserDocument>, moduleModel: Model<ModuleDocument>, notificationsService: NotificationsService);
    getHomeworksForCurator(curatorId: string): Promise<{
        id: import("mongoose").Types.ObjectId;
        studentId: string;
        studentName: string;
        moduleId: string;
        moduleTitle: string;
        moduleNumber: number | undefined;
        lessonNumber: number;
        answer: string;
        attachments: string[];
        status: "approved" | "needs_revision" | "pending" | "reviewed";
        score: number | undefined;
        feedback: string | undefined;
        submittedAt: Date;
        reviewedAt: Date | undefined;
    }[]>;
    reviewHomework(curatorId: string, homeworkId: string, score?: number, feedback?: string): Promise<{
        id: import("mongoose").Types.ObjectId;
        score: number | undefined;
        feedback: string | undefined;
        status: "reviewed";
        reviewedAt: Date;
    }>;
    returnForRevision(curatorId: string, homeworkId: string, feedback: string): Promise<{
        id: import("mongoose").Types.ObjectId;
        feedback: string;
        status: "needs_revision";
        reviewedAt: Date;
    }>;
    getMyStudents(curatorId: string): Promise<{
        id: import("mongoose").Types.ObjectId;
        firstName: string;
        lastName: string;
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
