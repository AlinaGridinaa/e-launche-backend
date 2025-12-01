import { Document, Types } from 'mongoose';
export type AchievementDocument = Achievement & Document;
export type UserAchievementDocument = UserAchievement & Document;
export declare class UserAchievement {
    userId: Types.ObjectId;
    achievementId: string;
    proofText?: string;
    proofFile?: string;
    proofLink?: string;
    status: 'pending' | 'approved' | 'rejected';
    curatorComment?: string;
    submittedAt: Date;
    approvedAt?: Date;
}
export declare const UserAchievementSchema: import("mongoose").Schema<UserAchievement, import("mongoose").Model<UserAchievement, any, any, any, Document<unknown, any, UserAchievement, any, {}> & UserAchievement & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserAchievement, Document<unknown, {}, import("mongoose").FlatRecord<UserAchievement>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<UserAchievement> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export interface AchievementType {
    id: string;
    title: string;
    emoji: string;
    description: string;
    category: 'sales' | 'content' | 'progress' | 'social';
}
export declare const ACHIEVEMENT_TYPES: AchievementType[];
export declare class Achievement {
    title: string;
    description: string;
    imageUrl: string;
    awardedAt: Date;
}
export declare const AchievementSchema: import("mongoose").Schema<Achievement, import("mongoose").Model<Achievement, any, any, any, Document<unknown, any, Achievement, any, {}> & Achievement & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Achievement, Document<unknown, {}, import("mongoose").FlatRecord<Achievement>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Achievement> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
