import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  phone?: string;

  @Prop()
  avatarUrl?: string;

  @Prop()
  faculty?: string;

  @Prop({ default: false })
  hasCompletedSorting: boolean;

  @Prop({ default: false })
  hasAcceptedRules: boolean;

  @Prop({ default: false })
  hasSeenWelcomeModal: boolean;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ default: false })
  isCurator: boolean;

  @Prop({ type: String })
  curatorId?: string; // ID куратора, який відповідає за цього студента

  @Prop({ 
    type: [{ 
      moduleId: { type: String, required: true },
      lessonNumber: { type: Number, required: true },
      addedAt: { type: Date, default: Date.now }
    }], 
    default: [] 
  })
  favoriteLessons: Array<{
    moduleId: string;
    lessonNumber: number;
    addedAt: Date;
  }>;

  @Prop({ 
    type: [{ 
      moduleId: { type: String, required: true },
      lessonNumber: { type: Number, required: true },
      completedAt: { type: Date, default: Date.now }
    }], 
    default: [] 
  })
  completedLessons: Array<{
    moduleId: string;
    lessonNumber: number;
    completedAt: Date;
  }>;

  @Prop({ type: [String], default: [] })
  completedModules: string[];

  @Prop({ default: 0 })
  earnings: number;

  @Prop({ 
    type: [{ 
      amount: { type: Number, required: true },
      date: { type: Date, required: true },
      description: String,
      createdAt: { type: Date, default: Date.now }
    }], 
    default: [] 
  })
  earningsHistory: Array<{
    _id?: string;
    amount: number;
    date: Date;
    description?: string;
    createdAt: Date;
  }>;

  @Prop({ 
    type: [{ 
      title: { type: String, required: true },
      description: { type: String, required: true },
      imageUrl: { type: String, required: true },
      awardedAt: { type: Date, default: Date.now }
    }], 
    default: [] 
  })
  achievements: Array<{
    _id?: string;
    title: string;
    description: string;
    imageUrl: string;
    awardedAt: Date;
  }>;
}

export const UserSchema = SchemaFactory.createForClass(User);
