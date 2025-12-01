import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Lesson, LessonSchema } from './lesson.schema';

export type ModuleDocument = Module & Document;

@Schema({ timestamps: true })
export class Module {
  @Prop({ required: true, unique: true })
  number: number;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  isLocked: boolean;

  @Prop()
  unlockDate: Date;

  @Prop({ type: [LessonSchema], default: [] })
  lessons: Lesson[];

  @Prop({ default: 0 })
  progress: number; // percentage 0-100

  @Prop()
  category: string; // e.g., "Бізнес", "Маркетинг", etc.

  @Prop()
  surveyFormUrl?: string; // Google Form or other survey link

  @Prop()
  surveyFormTitle?: string; // Title for the survey form
}

export const ModuleSchema = SchemaFactory.createForClass(Module);
