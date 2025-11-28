import { EventType } from '../../schemas/schedule-event.schema';
export declare class CreateScheduleEventDto {
    title: string;
    description?: string;
    date: string;
    time?: string;
    timeEurope?: string;
    type?: EventType;
    link?: string;
    speaker?: string;
    isCompleted?: boolean;
    notes?: string;
    tags?: string[];
}
