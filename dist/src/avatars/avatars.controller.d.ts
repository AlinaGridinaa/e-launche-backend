import { Model } from 'mongoose';
import { AvatarLevel, AvatarLevelDocument } from '../schemas/avatar-level.schema';
export declare class AvatarsController {
    private avatarLevelModel;
    constructor(avatarLevelModel: Model<AvatarLevelDocument>);
    getAllAvatars(): Promise<(import("mongoose").Document<unknown, {}, AvatarLevelDocument, {}, {}> & AvatarLevel & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getAvatarByLevel(level: number): Promise<(import("mongoose").Document<unknown, {}, AvatarLevelDocument, {}, {}> & AvatarLevel & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
}
