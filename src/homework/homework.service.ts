import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Homework } from '../schemas/homework.schema';
import { User } from '../schemas/user.schema';
import { Module as ModuleModel } from '../schemas/module.schema';
import { SubmitHomeworkDto } from './dto/submit-homework.dto';

@Injectable()
export class HomeworkService {
  constructor(
    @InjectModel(Homework.name) private homeworkModel: Model<Homework>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(ModuleModel.name) private moduleModel: Model<ModuleModel>,
  ) {}

  async submitHomework(userId: string, dto: SubmitHomeworkDto) {
    // Перевіряємо чи користувач існує
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    // Перевіряємо чи модуль існує
    const module = await this.moduleModel.findById(dto.moduleId);
    if (!module) {
      throw new NotFoundException('Модуль не знайдено');
    }

    // Перевіряємо чи вже існує подання для цього уроку
    const existingHomework = await this.homeworkModel.findOne({
      userId,
      moduleId: dto.moduleId,
      lessonNumber: dto.lessonNumber,
    });

    if (existingHomework) {
      // Оновлюємо існуюче подання
      existingHomework.answer = dto.answer;
      existingHomework.attachments = dto.attachments || [];
      existingHomework.status = 'pending';
      existingHomework.submittedAt = new Date();
      existingHomework.curatorId = user.curatorId;
      // Скидаємо попередню оцінку
      existingHomework.score = undefined;
      existingHomework.feedback = undefined;
      existingHomework.reviewedAt = undefined;
      
      await existingHomework.save();
      return existingHomework;
    }

    // Створюємо нове подання
    const homework = new this.homeworkModel({
      userId,
      moduleId: dto.moduleId,
      lessonNumber: dto.lessonNumber,
      answer: dto.answer,
      attachments: dto.attachments || [],
      status: 'pending',
      curatorId: user.curatorId,
      submittedAt: new Date(),
    });

    await homework.save();
    return homework;
  }

  async getMyHomework(userId: string, moduleId: string, lessonNumber: number) {
    const homework = await this.homeworkModel.findOne({
      userId,
      moduleId,
      lessonNumber,
    });

    return homework;
  }

  async getMyAllHomeworks(userId: string) {
    const homeworks = await this.homeworkModel.find({ userId }).sort({ submittedAt: -1 });
    
    // Додаємо інформацію про модуль
    const homeworksWithDetails = await Promise.all(
      homeworks.map(async (hw) => {
        const module = await this.moduleModel.findById(hw.moduleId);
        return {
          id: hw._id,
          moduleId: hw.moduleId,
          moduleTitle: module?.title || 'Невідомий модуль',
          moduleNumber: module?.number || 0,
          lessonNumber: hw.lessonNumber,
          answer: hw.answer,
          attachments: hw.attachments,
          status: hw.status,
          score: hw.score,
          feedback: hw.feedback,
          submittedAt: hw.submittedAt,
          reviewedAt: hw.reviewedAt,
        };
      }),
    );

    return homeworksWithDetails;
  }
}
