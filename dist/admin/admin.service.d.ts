import { Model } from 'mongoose';
import { UserDocument } from '../schemas/user.schema';
export declare class AdminService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    getAllUsers(): Promise<{
        id: import("mongoose").Types.ObjectId;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | undefined;
        faculty: string | undefined;
        isAdmin: boolean;
        earnings: number;
        completedLessonsCount: number;
        completedModulesCount: number;
    }[]>;
    assignFaculty(userId: string, faculty: string): Promise<{
        id: import("mongoose").Types.ObjectId;
        email: string;
        firstName: string;
        lastName: string;
        faculty: string;
    }>;
    toggleAdmin(userId: string): Promise<{
        id: import("mongoose").Types.ObjectId;
        email: string;
        isAdmin: boolean;
    }>;
}
