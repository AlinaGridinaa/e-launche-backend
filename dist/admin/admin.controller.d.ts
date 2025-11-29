import { AdminService } from './admin.service';
import { AssignFacultyDto } from './dto/assign-faculty.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
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
    assignFaculty(userId: string, assignFacultyDto: AssignFacultyDto): Promise<{
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
