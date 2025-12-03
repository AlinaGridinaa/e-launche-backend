import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Module, ModuleDocument } from '../schemas/module.schema';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class ModulesService {
  constructor(
    @InjectModel(Module.name) private moduleModel: Model<ModuleDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // Функція для отримання максимальної кількості модулів за тарифом
  private getMaxModulesByTariff(tariff?: string): number {
    if (!tariff) return 10; // Без тарифу - доступ до всіх модулів (для адмінів/кураторів)
    
    switch (tariff) {
      case 'Преміум':
        return 7;
      case 'ВІП':
        return 9;
      case 'Легенда':
        return 10;
      default:
        return 10;
    }
  }

  async findAll(): Promise<Module[]> {
    return this.moduleModel.find().exec();
  }

  async findAllWithUserProgress(userId: string): Promise<Module[]> {
    const modules = await this.moduleModel.find().lean().exec();
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      return modules.map(module => ({
        ...module,
        lessons: module.lessons.map(lesson => ({
          ...lesson,
          isCompleted: false,
        })),
      })) as Module[];
    }

    // Отримуємо максимальну кількість модулів за тарифом
    const maxModules = this.getMaxModulesByTariff(user.tariff);

    return modules.map(module => {
      // Перевіряємо чи доступний модуль за тарифом (адміни та куратори мають доступ до всіх)
      const isTariffLocked = !user.isAdmin && !user.isCurator && module.number > maxModules;

      return {
        ...module,
        isLocked: module.isLocked || isTariffLocked, // Модуль заблокований якщо або вручну заблокований, або за тарифом
        lessons: module.lessons.map(lesson => ({
          ...lesson,
          isCompleted: user.completedLessons?.some(
            cl => cl.moduleId.toString() === module._id.toString() && cl.lessonNumber === lesson.number
          ) || false,
        })),
      };
    }) as Module[];
  }

  async findById(id: string): Promise<Module | null> {
    return this.moduleModel.findById(id).exec();
  }

  async findByIdWithUserProgress(id: string, userId: string): Promise<Module | null> {
    const module = await this.moduleModel.findById(id).lean().exec();
    if (!module) return null;

    const user = await this.userModel.findById(userId).exec();
    
    if (!user) {
      return {
        ...module,
        lessons: module.lessons.map(lesson => ({
          ...lesson,
          isCompleted: false,
        })),
      } as Module;
    }

    // Перевіряємо доступ за тарифом
    const maxModules = this.getMaxModulesByTariff(user.tariff);
    const isTariffLocked = !user.isAdmin && !user.isCurator && module.number > maxModules;

    return {
      ...module,
      isLocked: module.isLocked || isTariffLocked,
      lessons: module.lessons.map(lesson => ({
        ...lesson,
        isCompleted: user.completedLessons?.some(
          cl => cl.moduleId.toString() === module._id.toString() && cl.lessonNumber === lesson.number
        ) || false,
      })),
    } as Module;
  }

  async findByNumber(number: number): Promise<Module | null> {
    return this.moduleModel.findOne({ number }).exec();
  }

  async create(moduleData: Partial<Module>): Promise<Module> {
    const newModule = new this.moduleModel(moduleData);
    return newModule.save();
  }

  async update(id: string, moduleData: Partial<Module>): Promise<Module | null> {
    return this.moduleModel
      .findByIdAndUpdate(id, moduleData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Module | null> {
    return this.moduleModel.findByIdAndDelete(id).exec();
  }

  async updateLessonCompletion(
    moduleId: string,
    lessonNumber: number,
    isCompleted: boolean,
  ): Promise<Module> {
    const module = await this.moduleModel.findById(moduleId).exec();
    if (!module) {
      throw new Error('Module not found');
    }

    const lesson = module.lessons.find((l) => l.number === lessonNumber);
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    lesson.isCompleted = isCompleted;

    // Recalculate progress
    const completedCount = module.lessons.filter((l) => l.isCompleted).length;
    module.progress = Math.round(
      (completedCount / module.lessons.length) * 100,
    );

    return module.save();
  }

  async deleteAll(): Promise<void> {
    await this.moduleModel.deleteMany({}).exec();
  }

  async createMany(modules: Partial<Module>[]): Promise<any[]> {
    return this.moduleModel.insertMany(modules);
  }
}
