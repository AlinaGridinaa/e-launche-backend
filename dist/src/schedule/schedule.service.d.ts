import { Model } from 'mongoose';
import { ScheduleEvent, ScheduleEventDocument } from '../schemas/schedule-event.schema';
import { CreateScheduleEventDto } from './dto/create-schedule-event.dto';
import { UpdateScheduleEventDto } from './dto/update-schedule-event.dto';
export declare class ScheduleService {
    private scheduleEventModel;
    constructor(scheduleEventModel: Model<ScheduleEventDocument>);
    create(createDto: CreateScheduleEventDto): Promise<ScheduleEvent>;
    findAll(): Promise<ScheduleEvent[]>;
    findUpcoming(): Promise<ScheduleEvent[]>;
    findByDateRange(startDate: Date, endDate: Date): Promise<ScheduleEvent[]>;
    findOne(id: string): Promise<ScheduleEvent | null>;
    update(id: string, updateDto: UpdateScheduleEventDto): Promise<ScheduleEvent | null>;
    markAsCompleted(id: string): Promise<ScheduleEvent | null>;
    remove(id: string): Promise<ScheduleEvent | null>;
}
