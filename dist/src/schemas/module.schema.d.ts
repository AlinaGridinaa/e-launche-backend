import { Document } from 'mongoose';
import { Lesson } from './lesson.schema';
export type ModuleDocument = Module & Document;
export declare class Module {
    number: number;
    title: string;
    description: string;
    isLocked: boolean;
    unlockDate: Date;
    lessons: Lesson[];
    progress: number;
    category: string;
    surveyFormUrl?: string;
    surveyFormTitle?: string;
}
export declare const ModuleSchema: import("mongoose").Schema<Module, import("mongoose").Model<Module, any, any, any, Document<unknown, any, Module, any, {}> & Module & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Module, Document<unknown, {}, import("mongoose").FlatRecord<Module>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Module> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
