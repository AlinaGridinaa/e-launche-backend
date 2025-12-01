import { Document } from 'mongoose';
export type ScheduleEventDocument = ScheduleEvent & Document;
export declare enum EventType {
    PLATFORM_OPENING = "platform_opening",
    LIVE_STREAM = "live_stream",
    MODULE_OPENING = "module_opening",
    ZOOM_MEETING = "zoom_meeting",
    GROUP_MEETING = "group_meeting"
}
export declare class ScheduleEvent {
    title: string;
    description?: string;
    date: Date;
    time?: string;
    timeEurope?: string;
    type: EventType;
    link?: string;
    speaker?: string;
    isCompleted: boolean;
    notes?: string;
    tags?: string[];
}
export declare const ScheduleEventSchema: import("mongoose").Schema<ScheduleEvent, import("mongoose").Model<ScheduleEvent, any, any, any, Document<unknown, any, ScheduleEvent, any, {}> & ScheduleEvent & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ScheduleEvent, Document<unknown, {}, import("mongoose").FlatRecord<ScheduleEvent>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ScheduleEvent> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
