import { AchievementsService, SubmitAchievementDto } from './achievements.service';
export declare class AchievementsController {
    private readonly achievementsService;
    constructor(achievementsService: AchievementsService);
    getAllTypes(): Promise<{
        success: boolean;
        data: import("../schemas/achievement.schema").AchievementType[];
    }>;
    getMyAchievements(req: any): Promise<{
        success: boolean;
        data: {
            isUnlocked: boolean;
            isPending: boolean;
            isRejected: boolean;
            submittedAt: Date | undefined;
            approvedAt: Date | undefined;
            curatorComment: string | undefined;
            userAchievementId: import("mongoose").Types.ObjectId | undefined;
            id: string;
            title: string;
            emoji: string;
            description: string;
            category: "sales" | "content" | "progress" | "social";
        }[];
    }>;
    submitAchievement(req: any, dto: SubmitAchievementDto): Promise<{
        success: boolean;
        data: import("mongoose").Document<unknown, {}, import("../schemas/achievement.schema").UserAchievementDocument, {}, {}> & import("../schemas/achievement.schema").UserAchievement & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        message: string;
    }>;
    getPendingAchievements(req: any): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: {
            achievementType: import("../schemas/achievement.schema").AchievementType | undefined;
            userId: import("mongoose").Types.ObjectId;
            achievementId: string;
            proofText?: string;
            proofFile?: string;
            proofLink?: string;
            status: "pending" | "approved" | "rejected";
            curatorComment?: string;
            submittedAt: Date;
            approvedAt?: Date;
            _id: import("mongoose").Types.ObjectId;
            $locals: Record<string, unknown>;
            $op: "save" | "validate" | "remove" | null;
            $where: Record<string, unknown>;
            baseModelName?: string;
            collection: import("mongoose").Collection;
            db: import("mongoose").Connection;
            errors?: import("mongoose").Error.ValidationError;
            id?: any;
            isNew: boolean;
            schema: import("mongoose").Schema;
            __v: number;
        }[];
        message?: undefined;
    }>;
    approveAchievement(req: any, id: string, body: {
        comment?: string;
    }): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: import("mongoose").Document<unknown, {}, import("../schemas/achievement.schema").UserAchievementDocument, {}, {}> & import("../schemas/achievement.schema").UserAchievement & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        message: string;
    }>;
    rejectAchievement(req: any, id: string, body: {
        comment: string;
    }): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: import("mongoose").Document<unknown, {}, import("../schemas/achievement.schema").UserAchievementDocument, {}, {}> & import("../schemas/achievement.schema").UserAchievement & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        message: string;
    }>;
}
