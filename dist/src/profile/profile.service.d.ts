import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { ModuleDocument } from '../schemas/module.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class ProfileService {
    private userModel;
    private moduleModel;
    constructor(userModel: Model<UserDocument>, moduleModel: Model<ModuleDocument>);
    getProfile(userId: string): Promise<{
        user: User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        stats: {
            modulesCompleted: number;
            totalModules: number;
            lessonsCompleted: number;
            totalLessons: number;
            earnings: number;
            rank: number;
        };
    }>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, {}> & User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateAvatar(userId: string, avatarUrl: string): Promise<{
        success: boolean;
        avatarUrl: string | undefined;
        user: User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    getEarnings(userId: string): Promise<{
        totalEarnings: number;
        history: {
            _id?: string;
            amount: number;
            date: Date;
            description?: string;
            createdAt: Date;
        }[];
    }>;
    addEarning(userId: string, earningData: {
        amount: number;
        date: string;
        description?: string;
    }): Promise<{
        success: boolean;
        message: string;
        totalEarnings: number;
        history: {
            _id?: string;
            amount: number;
            date: Date;
            description?: string;
            createdAt: Date;
        }[];
    }>;
    deleteEarning(userId: string, earningId: string): Promise<{
        success: boolean;
        message: string;
        totalEarnings: number;
        history: {
            _id?: string;
            amount: number;
            date: Date;
            description?: string;
            createdAt: Date;
        }[];
    }>;
    getLeaderboard(currentUserId: string): Promise<{
        rank: number;
        name: string;
        earnings: number;
        isCurrentUser: boolean;
    }[]>;
}
