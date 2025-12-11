import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HomeworkDocument = Homework & Document;

@Schema({ timestamps: true })
export class Homework {
  @Prop({ required: true })
  userId: string; // ID студента

  @Prop({ required: true })
  moduleId: string;

  @Prop({ required: true })
  lessonNumber: number;

  @Prop({ required: true })
  answer: string; // Відповідь студента

  @Prop({ type: [String], default: [] })
  attachments: string[]; // URL прикріплених файлів

  @Prop({ default: 'pending' })
  status: 'pending' | 'reviewed' | 'approved' | 'needs_revision'; // pending - очікує перевірки, reviewed - переглянуто, approved - затверджено, needs_revision - на доопрацювання

  @Prop()
  curatorId?: string; // ID куратора, який перевірив

  @Prop()
  score?: number; // Бали від куратора

  @Prop()
  feedback?: string; // Коментар куратора

  @Prop()
  audioFeedback?: string; // URL голосового коментаря куратора

  @Prop()
  reviewedAt?: Date; // Коли було перевірено

  @Prop({ default: Date.now })
  submittedAt: Date; // Коли було відправлено
}

export const HomeworkSchema = SchemaFactory.createForClass(Homework);
