import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Module, ModuleDocument } from '../schemas/module.schema';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Module.name) private moduleModel: Model<ModuleDocument>,
  ) {}

  async addToFavorites(userId: string, moduleId: string, lessonNumber: number) {
    console.log('addToFavorites called with:', { userId, moduleId, lessonNumber });
    console.log('userId type:', typeof userId);
    
    const user = await this.userModel.findById(userId).exec();
    console.log('User found:', user ? user.email : 'null');
    console.log('User ID from DB:', user ? user._id : 'null');
    
    if (!user) {
      // Спробуємо знайти всіх користувачів для дебагу
      const allUsers = await this.userModel.find().limit(5).exec();
      console.log('First 5 users in DB:', allUsers.map(u => ({ id: u._id, email: u.email })));
      throw new NotFoundException('Користувача не знайдено');
    }

    // Перевірка чи існує модуль і урок
    const module = await this.moduleModel.findById(moduleId);
    if (!module) {
      throw new NotFoundException('Модуль не знайдено');
    }

    const lesson = module.lessons.find(l => l.number === lessonNumber);
    if (!lesson) {
      throw new NotFoundException('Урок не знайдено');
    }

    // Перевірка чи вже в обраному
    const existingIndex = user.favoriteLessons.findIndex(
      fav => fav.moduleId === moduleId && fav.lessonNumber === lessonNumber
    );

    if (existingIndex === -1) {
      user.favoriteLessons.push({
        moduleId,
        lessonNumber,
        addedAt: new Date(),
      });
      await user.save();
    }

    return {
      success: true,
      lesson: {
        moduleId,
        lessonNumber,
        isFavorite: true,
      },
    };
  }

  async removeFromFavorites(userId: string, moduleId: string, lessonNumber: number) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    user.favoriteLessons = user.favoriteLessons.filter(
      fav => !(fav.moduleId === moduleId && fav.lessonNumber === lessonNumber)
    );

    await user.save();

    return {
      success: true,
      lesson: {
        moduleId,
        lessonNumber,
        isFavorite: false,
      },
    };
  }

  async getFavorites(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    const favorites: Array<{
      moduleId: any;
      moduleNumber: number;
      moduleTitle: string;
      lessonNumber: number;
      lessonTitle: string;
      videoUrl: string;
      description: string;
      duration: number;
      isCompleted: boolean;
      addedAt: Date;
    }> = [];

    // Отримуємо повну інформацію про кожен обраний урок
    for (const fav of user.favoriteLessons) {
      const module = await this.moduleModel.findById(fav.moduleId);
      if (module) {
        const lesson = module.lessons.find(l => l.number === fav.lessonNumber);
        if (lesson) {
          favorites.push({
            moduleId: module._id,
            moduleNumber: module.number,
            moduleTitle: module.title,
            lessonNumber: lesson.number,
            lessonTitle: lesson.title,
            videoUrl: lesson.videoUrl,
            description: lesson.description,
            duration: lesson.duration,
            isCompleted: lesson.isCompleted,
            addedAt: fav.addedAt,
          });
        }
      }
    }

    // Сортуємо за датою додавання (найновіші спочатку)
    favorites.sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime());

    return {
      favorites,
      total: favorites.length,
    };
  }

  async isFavorite(userId: string, moduleId: string, lessonNumber: number): Promise<boolean> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      return false;
    }

    return user.favoriteLessons.some(
      fav => fav.moduleId === moduleId && fav.lessonNumber === lessonNumber
    );
  }
}
