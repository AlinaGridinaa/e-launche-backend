import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Module, ModuleDocument } from '../schemas/module.schema';
import { getAvatarForLevel, getLevelByCompletedModules } from '../config/avatars.config';

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Module.name) private moduleModel: Model<ModuleDocument>,
  ) {}

  async completeLesson(
    userId: string, 
    moduleId: string, 
    lessonNumber: number,
    moodRating?: number,
    usefulnessRating?: number
  ) {
    const user = await this.userModel.findById(userId).exec();
    
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    // Перевіряємо чи урок вже завершено
    const existingLessonIndex = user.completedLessons?.findIndex(
      (lesson) => lesson.moduleId === moduleId && lesson.lessonNumber === lessonNumber
    );

    if (existingLessonIndex !== undefined && existingLessonIndex !== -1) {
      // Якщо урок вже завершено, оновлюємо оцінки
      if (moodRating !== undefined) {
        user.completedLessons[existingLessonIndex].moodRating = moodRating;
      }
      if (usefulnessRating !== undefined) {
        user.completedLessons[existingLessonIndex].usefulnessRating = usefulnessRating;
      }
    } else {
      // Якщо урок ще не завершено, додаємо новий запис
      if (!user.completedLessons) {
        user.completedLessons = [];
      }
      
      user.completedLessons.push({
        moduleId,
        lessonNumber,
        completedAt: new Date(),
        moodRating,
        usefulnessRating,
      });
    }

    // Перевіряємо чи всі уроки модуля завершені
    await this.checkAndCompleteModule(user, moduleId);

    await user.save();

    return {
      success: true,
      message: 'Урок позначено як завершений',
      completedLessons: user.completedLessons.length,
    };
  }

  private async checkAndCompleteModule(user: any, moduleId: string) {
    // Отримуємо модуль щоб дізнатися скільки в ньому уроків
    const module = await this.moduleModel.findById(moduleId).exec();
    if (!module) return;

    // Рахуємо скільки уроків цього модуля завершено
    const completedLessonsInModule = user.completedLessons?.filter(
      (lesson: any) => lesson.moduleId === moduleId
    ).length || 0;

    // Якщо всі уроки завершені і модуль ще не в списку завершених
    if (completedLessonsInModule === module.lessons.length) {
      if (!user.completedModules) {
        user.completedModules = [];
      }
      
      if (!user.completedModules.includes(moduleId)) {
        user.completedModules.push(moduleId);
        
        // Оновлюємо рівень аватара
        const newLevel = getLevelByCompletedModules(user.completedModules.length);
        user.currentAvatarLevel = newLevel;
        user.avatarUrl = getAvatarForLevel(newLevel);
      }
    }
  }

  async uncompleteLesson(userId: string, moduleId: string, lessonNumber: number) {
    const user = await this.userModel.findById(userId).exec();
    
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    if (user.completedLessons) {
      user.completedLessons = user.completedLessons.filter(
        (lesson) => !(lesson.moduleId === moduleId && lesson.lessonNumber === lessonNumber)
      );
      await user.save();
    }

    return {
      success: true,
      message: 'Урок позначено як незавершений',
      completedLessons: user.completedLessons?.length || 0,
    };
  }

  async completeModule(userId: string, moduleId: string) {
    const user = await this.userModel.findById(userId).exec();
    
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    if (!user.completedModules) {
      user.completedModules = [];
    }

    if (!user.completedModules.includes(moduleId)) {
      user.completedModules.push(moduleId);
      
      // Оновлюємо рівень аватара та сам аватар
      const newLevel = getLevelByCompletedModules(user.completedModules.length);
      user.currentAvatarLevel = newLevel;
      user.avatarUrl = getAvatarForLevel(newLevel);
      
      await user.save();
    }

    return {
      success: true,
      message: 'Модуль позначено як завершений',
      completedModules: user.completedModules.length,
      newAvatarLevel: user.currentAvatarLevel,
      newAvatarUrl: user.avatarUrl,
    };
  }

  async isLessonCompleted(userId: string, moduleId: string, lessonNumber: number): Promise<boolean> {
    const user = await this.userModel.findById(userId).exec();
    
    if (!user || !user.completedLessons) {
      return false;
    }

    return user.completedLessons.some(
      (lesson) => lesson.moduleId === moduleId && lesson.lessonNumber === lessonNumber
    );
  }
}
