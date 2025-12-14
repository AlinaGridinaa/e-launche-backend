import { Document } from 'mongoose';
export type HomeworkDocument = Homework & Document;
export declare class Homework {
    userId: string;
    moduleId: string;
    lessonNumber: number;
    answer: string;
    attachments: string[];
    fileAttachments: string[];
    status: 'pending' | 'reviewed' | 'approved' | 'needs_revision';
    curatorId?: string;
    score?: number;
    feedback?: string;
    audioFeedback?: string;
    reviewedAt?: Date;
    submittedAt: Date;
}
export declare const HomeworkSchema: import("mongoose").Schema<Homework, import("mongoose").Model<Homework, any, any, any, Document<unknown, any, Homework, any, {}> & Homework & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Homework, Document<unknown, {}, import("mongoose").FlatRecord<Homework>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Homework> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
