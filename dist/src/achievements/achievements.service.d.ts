import { Model } from 'mongoose';
import { UserAchievement, UserAchievementDocument, AchievementType } from '../schemas/achievement.schema';
import { UserDocument } from '../schemas/user.schema';
export interface SubmitAchievementDto {
    achievementId: string;
    proofText?: string;
    proofFile?: string;
    proofLink?: string;
}
export declare class AchievementsService {
    private userAchievementModel;
    private userModel;
    constructor(userAchievementModel: Model<UserAchievementDocument>, userModel: Model<UserDocument>);
    getAllAchievementTypes(): AchievementType[];
    getUserAchievements(userId: string): Promise<{
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
    }[]>;
    submitAchievement(userId: string, dto: SubmitAchievementDto): Promise<import("mongoose").Document<unknown, {}, UserAchievementDocument, {}, {}> & UserAchievement & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    approveAchievement(achievementId: string, curatorComment?: string): Promise<import("mongoose").Document<unknown, {}, UserAchievementDocument, {}, {}> & UserAchievement & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    rejectAchievement(achievementId: string, curatorComment: string): Promise<import("mongoose").Document<unknown, {}, UserAchievementDocument, {}, {}> & UserAchievement & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getAllPendingAchievements(): Promise<{
        achievementType: AchievementType | undefined;
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
    }[]>;
}
