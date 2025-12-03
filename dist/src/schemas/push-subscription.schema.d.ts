import { Document } from 'mongoose';
export type PushSubscriptionDocument = PushSubscription & Document;
export declare class PushSubscription {
    userId: string;
    endpoint: string;
    p256dh: string;
    auth: string;
    isActive: boolean;
}
export declare const PushSubscriptionSchema: import("mongoose").Schema<PushSubscription, import("mongoose").Model<PushSubscription, any, any, any, Document<unknown, any, PushSubscription, any, {}> & PushSubscription & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PushSubscription, Document<unknown, {}, import("mongoose").FlatRecord<PushSubscription>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<PushSubscription> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
