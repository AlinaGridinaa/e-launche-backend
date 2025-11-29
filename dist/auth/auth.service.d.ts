import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService);
    login(loginDto: LoginDto): Promise<{
        success: boolean;
        user: {
            email: string;
            firstName: string;
            lastName: string;
            phone?: string;
            avatarUrl?: string;
            faculty?: string;
            hasCompletedSorting: boolean;
            hasAcceptedRules: boolean;
            hasSeenWelcomeModal: boolean;
            isAdmin: boolean;
            favoriteLessons: Array<{
                moduleId: string;
                lessonNumber: number;
                addedAt: Date;
            }>;
            completedLessons: Array<{
                moduleId: string;
                lessonNumber: number;
                completedAt: Date;
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
        };
        token: string;
    }>;
    private generateToken;
    validateUser(userId: string): Promise<(import("mongoose").Document<unknown, {}, UserDocument, {}, {}> & User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
}
