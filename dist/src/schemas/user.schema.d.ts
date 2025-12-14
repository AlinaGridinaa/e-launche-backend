import { Document } from 'mongoose';
export type UserDocument = User & Document;
export declare class User {
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
    phoneOrTelegram?: string;
    group?: string;
    accessUntil?: Date;
    tariff?: string;
    avatarUrl?: string;
    currentAvatarLevel: number;
    faculty?: string;
    hasCompletedSorting: boolean;
    hasAcceptedRules: boolean;
    hasSeenWelcomeModal: boolean;
    isAdmin: boolean;
    isCurator: boolean;
    curatorId?: string;
    favoriteLessons: Array<{
        moduleId: string;
        lessonNumber: number;
        addedAt: Date;
    }>;
    completedLessons: Array<{
        moduleId: string;
        lessonNumber: number;
        completedAt: Date;
        moodRating?: number;
        usefulnessRating?: number;
    }>;
    completedModules: string[];
    earnings: number;
    earningsHistory: Array<{
        _id?: string;
        amount: number;
        date: Date;
        description?: string;
        createdAt: Date;
    }>;
    achievements: Array<{
        _id?: string;
        title: string;
        description: string;
        imageUrl: string;
        awardedAt: Date;
    }>;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
