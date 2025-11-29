import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class ProfileController {
    private readonly profileService;
    constructor(profileService: ProfileService);
    getProfile(req: any): Promise<{
        user: import("../schemas/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    updateProfile(req: any, updateProfileDto: UpdateProfileDto): Promise<import("mongoose").Document<unknown, {}, import("../schemas/user.schema").UserDocument, {}, {}> & import("../schemas/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    uploadAvatar(req: any, file: Express.Multer.File): Promise<{
        success: boolean;
        avatarUrl: string | undefined;
        user: import("../schemas/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    getEarnings(req: any): Promise<{
        totalEarnings: number;
        history: {
            _id?: string;
            amount: number;
            date: Date;
            description?: string;
            createdAt: Date;
        }[];
    }>;
    addEarning(req: any, addEarningDto: any): Promise<{
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
    deleteEarning(req: any, earningId: string): Promise<{
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
    getLeaderboard(req: any): Promise<{
        rank: number;
        name: string;
        earnings: number;
        isCurrentUser: boolean;
    }[]>;
}
