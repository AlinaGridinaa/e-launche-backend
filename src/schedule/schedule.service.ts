import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScheduleEvent, ScheduleEventDocument } from '../schemas/schedule-event.schema';
import { CreateScheduleEventDto } from './dto/create-schedule-event.dto';
import { UpdateScheduleEventDto } from './dto/update-schedule-event.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(ScheduleEvent.name)
    private scheduleEventModel: Model<ScheduleEventDocument>,
  ) {}

  async create(createDto: CreateScheduleEventDto): Promise<ScheduleEvent> {
    const event = new this.scheduleEventModel(createDto);
    return event.save();
  }

  async findAll(): Promise<ScheduleEvent[]> {
    return this.scheduleEventModel
      .find()
      .sort({ date: 1 }) // Сортування за датою (від найближчої)
      .exec();
  }

  async findUpcoming(): Promise<ScheduleEvent[]> {
    const now = new Date();
    return this.scheduleEventModel
      .find({
        date: { $gte: now },
        isCompleted: false,
      })
      .sort({ date: 1 })
      .exec();
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<ScheduleEvent[]> {
    return this.scheduleEventModel
      .find({
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .sort({ date: 1 })
      .exec();
  }

  async findOne(id: string): Promise<ScheduleEvent | null> {
    return this.scheduleEventModel.findById(id).exec();
  }

  async update(
    id: string,
    updateDto: UpdateScheduleEventDto,
  ): Promise<ScheduleEvent | null> {
    return this.scheduleEventModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
  }

  async markAsCompleted(id: string): Promise<ScheduleEvent | null> {
    return this.scheduleEventModel
      .findByIdAndUpdate(id, { isCompleted: true }, { new: true })
      .exec();
  }

  async remove(id: string): Promise<ScheduleEvent | null> {
    return this.scheduleEventModel.findByIdAndDelete(id).exec();
  }
}
