import { Model } from 'mongoose';
import { UserDocument } from '../schemas/user.schema';
import { Module, ModuleDocument } from '../schemas/module.schema';
import { AvatarLevel, AvatarLevelDocument } from '../schemas/avatar-level.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { AwardAchievementDto } from './dto/award-achievement.dto';
export declare class AdminService {
    private userModel;
    private moduleModel;
    private avatarLevelModel;
    constructor(userModel: Model<UserDocument>, moduleModel: Model<ModuleDocument>, avatarLevelModel: Model<AvatarLevelDocument>);
    private loadAvatarsToCache;
    getAllUsers(): Promise<{
        id: import("mongoose").Types.ObjectId;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | undefined;
        faculty: string | undefined;
        isAdmin: boolean;
        isCurator: boolean;
        curatorId: string | undefined;
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
    getStats(): Promise<{
        totalUsers: number;
        totalModules: number;
        totalLessons: number;
        activeUsers: number;
    }>;
    createUser(createUserDto: CreateUserDto): Promise<{
        id: import("mongoose").Types.ObjectId;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | undefined;
        faculty: string | undefined;
        isAdmin: boolean;
        isCurator: boolean;
        earnings: number;
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
    assignCurator(userId: string, curatorId: string): Promise<{
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
    getModuleById(moduleId: string): Promise<import("mongoose").Document<unknown, {}, ModuleDocument, {}, {}> & Module & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    }): Promise<import("mongoose").Document<unknown, {}, ModuleDocument, {}, {}> & Module & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    }): Promise<import("mongoose").Document<unknown, {}, ModuleDocument, {}, {}> & Module & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    getAllAvatarLevels(): Promise<(import("mongoose").Document<unknown, {}, AvatarLevelDocument, {}, {}> & AvatarLevel & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getAvatarLevel(level: number): Promise<import("mongoose").Document<unknown, {}, AvatarLevelDocument, {}, {}> & AvatarLevel & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    setAvatarLevel(level: number, imageUrl: string, description?: string): Promise<import("mongoose").Document<unknown, {}, AvatarLevelDocument, {}, {}> & AvatarLevel & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
}
