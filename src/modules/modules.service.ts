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

  async findAll(): Promise<Module[]> {
    return this.moduleModel.find().exec();
  }

  async findAllWithUserProgress(userId: string): Promise<Module[]> {
    const modules = await this.moduleModel.find().lean().exec();
    const user = await this.userModel.findById(userId).exec();

    if (!user || !user.completedLessons) {
      return modules.map(module => ({
        ...module,
        lessons: module.lessons.map(lesson => ({
          ...lesson,
          isCompleted: false,
        })),
      })) as Module[];
    }

    return modules.map(module => ({
      ...module,
      lessons: module.lessons.map(lesson => ({
        ...lesson,
        isCompleted: user.completedLessons.some(
          cl => cl.moduleId.toString() === module._id.toString() && cl.lessonNumber === lesson.number
        ),
      })),
    })) as Module[];
  }

  async findById(id: string): Promise<Module | null> {
    return this.moduleModel.findById(id).exec();
  }

  async findByIdWithUserProgress(id: string, userId: string): Promise<Module | null> {
    const module = await this.moduleModel.findById(id).lean().exec();
    if (!module) return null;

    const user = await this.userModel.findById(userId).exec();
    
    if (!user || !user.completedLessons) {
      return {
        ...module,
        lessons: module.lessons.map(lesson => ({
          ...lesson,
          isCompleted: false,
        })),
      } as Module;
    }

    return {
      ...module,
      lessons: module.lessons.map(lesson => ({
        ...lesson,
        isCompleted: user.completedLessons.some(
          cl => cl.moduleId.toString() === module._id.toString() && cl.lessonNumber === lesson.number
        ),
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
