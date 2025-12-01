import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AchievementDocument = Achievement & Document;

// Схема для користувацької нагороди (коли користувач отримав нагороду)
export type UserAchievementDocument = UserAchievement & Document;

@Schema({ timestamps: true })
export class UserAchievement {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  achievementId: string; // ID типу нагороди

  @Prop()
  proofText?: string; // Текст підтвердження

  @Prop()
  proofFile?: string; // Посилання на файл

  @Prop()
  proofLink?: string; // Посилання

  @Prop({ default: 'pending' })
  status: 'pending' | 'approved' | 'rejected'; // Статус перевірки

  @Prop()
  curatorComment?: string; // Коментар куратора

  @Prop({ default: Date.now })
  submittedAt: Date;

  @Prop()
  approvedAt?: Date;
}

export const UserAchievementSchema = SchemaFactory.createForClass(UserAchievement);

// Типи нагород (статичний список)
export interface AchievementType {
  id: string;
  title: string;
  emoji: string;
  description: string;
  category: 'sales' | 'content' | 'progress' | 'social';
}

export const ACHIEVEMENT_TYPES: AchievementType[] = [
  {
    id: 'first_sale',
    title: 'Перша продажа',
    emoji: '💸',
    description: 'Отримали першу оплату за продукт або послугу.',
    category: 'sales',
  },
  {
    id: 'three_sales',
    title: 'Три продажі',
    emoji: '🔥',
    description: 'Зробили 3 продажі поспіль — стабільність починає рости.',
    category: 'sales',
  },
  {
    id: 'first_100',
    title: 'Перші 100$',
    emoji: '💵',
    description: 'Перший дохід у 100$ — важливий старт.',
    category: 'sales',
  },
  {
    id: 'first_1000',
    title: 'Перша тисяча',
    emoji: '💰',
    description: 'Досягнули перших 1000$ — новий рівень.',
    category: 'sales',
  },
  {
    id: 'start_post',
    title: 'Стартовий крок',
    emoji: '🚀',
    description: 'Опублікували пост про початок навчання — публічний намір рухатися вперед.',
    category: 'social',
  },
  {
    id: 'online_presence',
    title: 'Онлайн-присутність',
    emoji: '🖥️',
    description: 'Скріншот вашої участі у онлайн-уроці Дмитра.',
    category: 'progress',
  },
  {
    id: 'weekly_results',
    title: 'Навчальний тиждень',
    emoji: '📅',
    description: 'Позначка у сторіс про ваші результати за тиждень.',
    category: 'progress',
  },
  {
    id: 'expert_found',
    title: 'Знайдений експерт',
    emoji: '🤝',
    description: 'Скріншот про те, що експерта обрано. Уклали першу домовленість про співпрацю.',
    category: 'progress',
  },
  {
    id: 'expert_live',
    title: 'Ефір з експертом',
    emoji: '🎙️',
    description: 'Провели спільний прямий ефір.',
    category: 'content',
  },
  {
    id: 'three_stories',
    title: '3 сторіс поспіль',
    emoji: '📖',
    description: 'Вели блог 3 дні поспіль без пропусків.',
    category: 'content',
  },
  {
    id: 'first_reels',
    title: 'Перший Reels',
    emoji: '🎬',
    description: 'Опублікували перше коротке експертне відео.',
    category: 'content',
  },
  {
    id: 'reach_1000',
    title: '1000 охоплень',
    emoji: '📊',
    description: 'Отримали перші значні охоплення у рілс/пості/сторіс.',
    category: 'social',
  },
  {
    id: 'reactions_20',
    title: '20 реакцій',
    emoji: '❤️',
    description: 'Зібрали 20 відповідей або реакцій на сторіс.',
    category: 'social',
  },
  {
    id: 'viral_post',
    title: 'Пост-вірус',
    emoji: '💥',
    description: 'Пост набрав у 2 рази більше охоплень, ніж зазвичай.',
    category: 'social',
  },
  {
    id: 'brave_post',
    title: 'Сміливий пост',
    emoji: '🔓',
    description: 'Опублікували відвертий, особистий, сміливий пост.',
    category: 'content',
  },
  {
    id: 'updated_avatar',
    title: 'Оновлений аватар',
    emoji: '✨',
    description: 'Оновили професійну упаковку профілю.',
    category: 'social',
  },
  {
    id: 'warmup_ready',
    title: 'Прогрів готовий',
    emoji: '🔧',
    description: 'Зібрали перший повноцінний прогрів.',
    category: 'content',
  },
  {
    id: 'hashtag_win',
    title: 'Хештег-перемога',
    emoji: '🏷️',
    description: 'Скрін посту в чаті з хештегом «#перемога»',
    category: 'social',
  },
  {
    id: 'live_stream',
    title: 'Прямий ефір',
    emoji: '🌐',
    description: 'Скрін прямого ефіру вашого або експерта.',
    category: 'content',
  },
];

// Старі схеми для сумісності (видалимо пізніше)
@Schema({ timestamps: true })
export class Achievement {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ default: Date.now })
  awardedAt: Date;
}

export const AchievementSchema = SchemaFactory.createForClass(Achievement);
