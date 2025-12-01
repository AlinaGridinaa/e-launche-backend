import { Document } from 'mongoose';
export type AvatarLevelDocument = AvatarLevel & Document;
export declare class AvatarLevel {
    level: number;
    imageUrl: string;
    description?: string;
}
export declare const AvatarLevelSchema: import("mongoose").Schema<AvatarLevel, import("mongoose").Model<AvatarLevel, any, any, any, Document<unknown, any, AvatarLevel, any, {}> & AvatarLevel & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AvatarLevel, Document<unknown, {}, import("mongoose").FlatRecord<AvatarLevel>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<AvatarLevel> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
