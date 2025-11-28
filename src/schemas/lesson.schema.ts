import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LessonDocument = Lesson & Document;

export class LessonMaterial {
  @Prop({ required: true })
  type: string; // 'pdf', 'link', 'video', 'spreadsheet', 'document'

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  url: string;
}

@Schema({ timestamps: true })
export class Lesson {
  @Prop({ required: true })
  number: number;

  @Prop({ required: true })
  title: string;

  @Prop()
  videoUrl: string;

  @Prop()
  description: string;

  @Prop({ type: [LessonMaterial], default: [] })
  materials: LessonMaterial[];

  @Prop()
  homework: string;

  @Prop({ default: 0 })
  duration: number; // in minutes

  @Prop({ default: false })
  isCompleted: boolean;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
