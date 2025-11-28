import { Document } from 'mongoose';
export type LessonDocument = Lesson & Document;
export declare class LessonMaterial {
    type: string;
    title: string;
    url: string;
}
export declare class Lesson {
    number: number;
    title: string;
    videoUrl: string;
    description: string;
    materials: LessonMaterial[];
    homework: string;
    duration: number;
    isCompleted: boolean;
}
export declare const LessonSchema: import("mongoose").Schema<Lesson, import("mongoose").Model<Lesson, any, any, any, Document<unknown, any, Lesson, any, {}> & Lesson & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Lesson, Document<unknown, {}, import("mongoose").FlatRecord<Lesson>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Lesson> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
