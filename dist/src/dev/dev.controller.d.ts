import { Model } from 'mongoose';
import { UserDocument } from '../schemas/user.schema';
import { ScheduleEvent, ScheduleEventDocument, EventType } from '../schemas/schedule-event.schema';
import { ModulesService } from '../modules/modules.service';
export declare class DevController {
    private userModel;
    private scheduleModel;
    private modulesService;
    constructor(userModel: Model<UserDocument>, scheduleModel: Model<ScheduleEventDocument>, modulesService: ModulesService);
    seed(): Promise<{
        success: boolean;
        message: string;
        users: {
            email: string;
            password: string;
        }[];
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
        users?: undefined;
    }>;
    seedSchedule(): Promise<{
        success: boolean;
        message: string;
        count: number;
        events: import("mongoose").MergeType<import("mongoose").Document<unknown, {}, ScheduleEventDocument, {}, {}> & ScheduleEvent & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        }, Omit<{
            title: string;
            description: string;
            date: Date;
            type: EventType;
            tags: string[];
            time?: undefined;
            timeEurope?: undefined;
            speaker?: undefined;
            notes?: undefined;
        } | {
            title: string;
            description: string;
            date: Date;
            time: string;
            timeEurope: string;
            type: EventType;
            speaker: string;
            tags: string[];
            notes?: undefined;
        } | {
            title: string;
            description: string;
            date: Date;
            type: EventType;
            tags: string[];
            notes: string;
            time?: undefined;
            timeEurope?: undefined;
            speaker?: undefined;
        }, "_id">>[];
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
        count?: undefined;
        events?: undefined;
    }>;
    fixFaculty(): Promise<{
        success: boolean;
        message: string;
        user?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        user: {
            email: string;
            firstName: string;
            lastName: string;
            faculty: string;
        };
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
        user?: undefined;
    }>;
    resetWelcomeModal(): Promise<{
        success: boolean;
        message: string;
        user?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        user: {
            email: string;
            hasSeenWelcomeModal: boolean;
            faculty: string | undefined;
        };
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
        user?: undefined;
    }>;
    seedModules(): Promise<{
        success: boolean;
        message: string;
        count: number;
        modules: {
            number: any;
            title: any;
            lessonCount: any;
            isLocked: any;
        }[];
        error?: undefined;
        stack?: undefined;
    } | {
        success: boolean;
        error: any;
        stack: any;
        message?: undefined;
        count?: undefined;
        modules?: undefined;
    }>;
    private parseCSV;
    private parseCSVLine;
    private parseMaterials;
}
