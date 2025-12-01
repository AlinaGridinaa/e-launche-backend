import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AvatarLevelDocument = AvatarLevel & Document;

@Schema()
export class AvatarLevel {
  @Prop({ required: true, unique: true })
  level: number;

  @Prop({ required: true })
  imageUrl: string;

  @Prop()
  description?: string;
}

export const AvatarLevelSchema = SchemaFactory.createForClass(AvatarLevel);
