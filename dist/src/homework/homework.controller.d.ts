import { HomeworkService } from './homework.service';
import { SubmitHomeworkDto } from './dto/submit-homework.dto';
export declare class HomeworkController {
    private readonly homeworkService;
    constructor(homeworkService: HomeworkService);
    submitHomework(req: any, dto: SubmitHomeworkDto): Promise<import("mongoose").Document<unknown, {}, import("../schemas/homework.schema").Homework, {}, {}> & import("../schemas/homework.schema").Homework & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getMyHomework(req: any, moduleId: string, lessonNumber: number): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/homework.schema").Homework, {}, {}> & import("../schemas/homework.schema").Homework & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    getMyAllHomeworks(req: any): Promise<{
        id: import("mongoose").Types.ObjectId;
        moduleId: string;
        moduleTitle: string;
        moduleNumber: number;
        lessonNumber: number;
        answer: string;
        attachments: string[];
        status: "approved" | "needs_revision" | "pending" | "reviewed";
        score: number | undefined;
        feedback: string | undefined;
        submittedAt: Date;
        reviewedAt: Date | undefined;
    }[]>;
}
