import { Model } from 'mongoose';
import { Homework } from '../schemas/homework.schema';
import { User } from '../schemas/user.schema';
import { Module as ModuleModel } from '../schemas/module.schema';
import { SubmitHomeworkDto } from './dto/submit-homework.dto';
export declare class HomeworkService {
    private homeworkModel;
    private userModel;
    private moduleModel;
    constructor(homeworkModel: Model<Homework>, userModel: Model<User>, moduleModel: Model<ModuleModel>);
    submitHomework(userId: string, dto: SubmitHomeworkDto): Promise<import("mongoose").Document<unknown, {}, Homework, {}, {}> & Homework & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getMyHomework(userId: string, moduleId: string, lessonNumber: number): Promise<(import("mongoose").Document<unknown, {}, Homework, {}, {}> & Homework & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    getMyAllHomeworks(userId: string): Promise<{
        id: import("mongoose").Types.ObjectId;
        moduleId: string;
        moduleTitle: string;
        moduleNumber: number;
        lessonNumber: number;
        answer: string;
        attachments: string[];
        status: "pending" | "reviewed" | "approved" | "needs_revision";
        score: number | undefined;
        feedback: string | undefined;
        submittedAt: Date;
        reviewedAt: Date | undefined;
    }[]>;
}
