import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, response: Response): Promise<{
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
    logout(response: Response): {
        success: boolean;
        message: string;
    };
    getProfile(request: Request & {
        user: any;
    }): Promise<{
        success: boolean;
        message: string;
    } | {
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
        success: boolean;
        message?: undefined;
    }>;
}
