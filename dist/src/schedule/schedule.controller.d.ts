import { ScheduleService } from './schedule.service';
import { CreateScheduleEventDto } from './dto/create-schedule-event.dto';
import { UpdateScheduleEventDto } from './dto/update-schedule-event.dto';
export declare class ScheduleController {
    private readonly scheduleService;
    constructor(scheduleService: ScheduleService);
    findAll(): Promise<{
        success: boolean;
        data: import("../schemas/schedule-event.schema").ScheduleEvent[];
    }>;
    findUpcoming(): Promise<{
        success: boolean;
        data: import("../schemas/schedule-event.schema").ScheduleEvent[];
    }>;
    findByDateRange(startDate: string, endDate: string): Promise<{
        success: boolean;
        data: import("../schemas/schedule-event.schema").ScheduleEvent[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: import("../schemas/schedule-event.schema").ScheduleEvent | null;
    }>;
    create(createDto: CreateScheduleEventDto): Promise<{
        success: boolean;
        data: import("../schemas/schedule-event.schema").ScheduleEvent;
        message: string;
    }>;
    update(id: string, updateDto: UpdateScheduleEventDto): Promise<{
        success: boolean;
        data: import("../schemas/schedule-event.schema").ScheduleEvent | null;
        message: string;
    }>;
    markAsCompleted(id: string): Promise<{
        success: boolean;
        data: import("../schemas/schedule-event.schema").ScheduleEvent | null;
        message: string;
    }>;
    remove(id: string): Promise<void>;
}
