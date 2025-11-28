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
            isAdmin: boolean;
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
    }>;
    logout(response: Response): {
        success: boolean;
        message: string;
    };
    getProfile(request: Request & {
        user: any;
    }): Promise<{
        success: boolean;
        user: any;
    }>;
}
