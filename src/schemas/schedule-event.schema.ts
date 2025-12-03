import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ScheduleEventDocument = ScheduleEvent & Document;

export enum EventType {
  ONLINE_MEETING = 'online_meeting',
  PLATFORM_OPENING = 'platform_opening',
  LIVE_STREAM = 'live_stream',
  MODULE_OPENING = 'module_opening',
  ZOOM_MEETING = 'zoom_meeting',
  GROUP_MEETING = 'group_meeting',
}

@Schema({ timestamps: true })
export class ScheduleEvent {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  date: Date;

  @Prop()
  time?: string; // Наприклад: "20:00"

  @Prop()
  timeEurope?: string; // Наприклад: "19:00"

  @Prop({ 
    type: String, 
    enum: EventType,
    required: false
  })
  type?: EventType;

  @Prop()
  link?: string; // Посилання на Zoom, YouTube тощо

  @Prop()
  speaker?: string; // Хто проводить (наприклад: "Олег Лобанов", "Ректор")

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop()
  notes?: string; // Додаткові нотатки

  @Prop({ type: [String], default: [] })
  tags?: string[]; // Теги для фільтрації (наприклад: ["досвідчені", "всі"])
}

export const ScheduleEventSchema = SchemaFactory.createForClass(ScheduleEvent);
