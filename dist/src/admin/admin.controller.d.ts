import { AdminService } from './admin.service';
import { AssignFacultyDto } from './dto/assign-faculty.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { AwardAchievementDto } from './dto/award-achievement.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getAllUsers(): Promise<{
        id: import("mongoose").Types.ObjectId;
        email: string;
        firstName: string;
        lastName: string;
        phoneOrTelegram: string | undefined;
        group: string | undefined;
        accessUntil: Date | undefined;
        tariff: string | undefined;
        faculty: string | undefined;
        isAdmin: boolean;
        isCurator: boolean;
        curatorId: string | undefined;
        earnings: number;
        completedLessonsCount: number;
        completedModulesCount: number;
    }[]>;
    createUser(createUserDto: CreateUserDto): Promise<{
        id: import("mongoose").Types.ObjectId;
        email: string;
        firstName: string;
        lastName: string;
        phoneOrTelegram: string | undefined;
        group: string | undefined;
        accessUntil: Date | undefined;
        tariff: string | undefined;
        faculty: string | undefined;
        isAdmin: boolean;
        isCurator: boolean;
        earnings: number;
    }>;
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
    getStats(): Promise<{
        totalUsers: number;
        totalModules: number;
        totalLessons: number;
        activeUsers: number;
    }>;
    awardAchievement(userId: string, achievementDto: AwardAchievementDto): Promise<{
        id: import("mongoose").Types.ObjectId;
        firstName: string;
        lastName: string;
        achievements: {
            _id?: string;
            title: string;
            description: string;
            imageUrl: string;
            awardedAt: Date;
        }[];
    }>;
    getUserAchievements(userId: string): Promise<{
        id: import("mongoose").Types.ObjectId;
        firstName: string;
        lastName: string;
        achievements: {
            _id?: string;
            title: string;
            description: string;
            imageUrl: string;
            awardedAt: Date;
        }[];
    }>;
    removeAchievement(userId: string, achievementId: string): Promise<{
        id: import("mongoose").Types.ObjectId;
        achievements: {
            _id?: string;
            title: string;
            description: string;
            imageUrl: string;
            awardedAt: Date;
        }[];
    }>;
    toggleCurator(userId: string): Promise<{
        id: import("mongoose").Types.ObjectId;
        email: string;
        isCurator: boolean;
    }>;
    assignCurator(userId: string, body: {
        curatorId: string;
    }): Promise<{
        id: import("mongoose").Types.ObjectId;
        curatorId: string;
        curatorName: string;
    }>;
    getAllCurators(): Promise<{
        id: import("mongoose").Types.ObjectId;
        name: string;
        email: string;
    }[]>;
    getAllModules(): Promise<{
        id: import("mongoose").Types.ObjectId;
        number: number;
        title: string;
        description: string;
        isLocked: boolean;
        unlockDate: Date;
        category: string;
        lessonsCount: number;
    }[]>;
    getModuleById(moduleId: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/module.schema").ModuleDocument, {}, {}> & import("../schemas/module.schema").Module & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    createModule(moduleData: {
        number: number;
        title: string;
        description?: string;
        category?: string;
        isLocked?: boolean;
        unlockDate?: Date;
    }): Promise<import("mongoose").Document<unknown, {}, import("../schemas/module.schema").ModuleDocument, {}, {}> & import("../schemas/module.schema").Module & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateModule(moduleId: string, updateData: {
        number?: number;
        title?: string;
        description?: string;
        category?: string;
        isLocked?: boolean;
        unlockDate?: Date;
    }): Promise<import("mongoose").Document<unknown, {}, import("../schemas/module.schema").ModuleDocument, {}, {}> & import("../schemas/module.schema").Module & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    deleteModule(moduleId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    toggleModuleLock(moduleId: string): Promise<{
        id: import("mongoose").Types.ObjectId;
        isLocked: boolean;
    }>;
    createLesson(moduleId: string, lessonData: {
        number: number;
        title: string;
        description?: string;
        videoUrl?: string;
        homework?: string;
        duration?: number;
    }): Promise<{
        number: number;
        title: string;
        description: string;
        videoUrl: string;
        homework: string;
        duration: number;
        materials: never[];
        isCompleted: boolean;
    }>;
    updateLesson(moduleId: string, lessonNumber: number, updateData: {
        title?: string;
        description?: string;
        videoUrl?: string;
        homework?: string;
        duration?: number;
    }): Promise<import("../schemas/lesson.schema").Lesson>;
    deleteLesson(moduleId: string, lessonNumber: number): Promise<{
        success: boolean;
        message: string;
    }>;
    addLessonMaterial(moduleId: string, lessonNumber: number, materialData: {
        type: string;
        title: string;
        url: string;
    }): Promise<import("../schemas/lesson.schema").Lesson>;
    deleteLessonMaterial(moduleId: string, lessonNumber: number, materialIndex: number): Promise<import("../schemas/lesson.schema").Lesson>;
    getAllAvatarLevels(): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/avatar-level.schema").AvatarLevelDocument, {}, {}> & import("../schemas/avatar-level.schema").AvatarLevel & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getAvatarLevel(level: number): Promise<import("mongoose").Document<unknown, {}, import("../schemas/avatar-level.schema").AvatarLevelDocument, {}, {}> & import("../schemas/avatar-level.schema").AvatarLevel & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    setAvatarLevel(level: number, body: {
        imageUrl: string;
        description?: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("../schemas/avatar-level.schema").AvatarLevelDocument, {}, {}> & import("../schemas/avatar-level.schema").AvatarLevel & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    deleteAvatarLevel(level: number): Promise<{
        message: string;
    }>;
    initializeDefaultAvatars(): Promise<{
        message: string;
        count: number;
    }>;
    uploadAvatarImage(level: number, file: Express.Multer.File, description?: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/avatar-level.schema").AvatarLevelDocument, {}, {}> & import("../schemas/avatar-level.schema").AvatarLevel & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getLessonRatings(moduleId?: string): Promise<{
        userId: any;
        userEmail: string;
        userName: string;
        moduleId: string;
        lessonNumber: number;
        moodRating?: number;
        usefulnessRating?: number;
        completedAt: Date;
    }[]>;
    sendCustomNotification(body: {
        title: string;
        message: string;
        url?: string;
        sendToAll: boolean;
        userIds?: string[];
    }): Promise<{
        sent: number;
        failed: number;
    }>;
}
