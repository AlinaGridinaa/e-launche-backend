import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Homework } from '../schemas/homework.schema';
import { User } from '../schemas/user.schema';
import { Module as ModuleModel } from '../schemas/module.schema';
import { SubmitHomeworkDto } from './dto/submit-homework.dto';
import { uploadBufferToCloudinary } from '../config/cloudinary.config';

@Injectable()
export class HomeworkService {
  constructor(
    @InjectModel(Homework.name) private homeworkModel: Model<Homework>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(ModuleModel.name) private moduleModel: Model<ModuleModel>,
  ) {}

  async submitHomework(userId: string, dto: any, files?: Express.Multer.File[]) {
    // Парсимо attachments з JSON string якщо вони є
    let attachments: string[] = [];
    if (dto.attachments) {
      try {
        attachments = typeof dto.attachments === 'string' 
          ? JSON.parse(dto.attachments) 
          : dto.attachments;
      } catch (error) {
        console.error('Failed to parse attachments:', error);
        attachments = [];
      }
    }

    // Парсимо lessonNumber
    const lessonNumber = parseInt(dto.lessonNumber, 10);
    if (isNaN(lessonNumber)) {
      throw new BadRequestException('lessonNumber повинен бути числом');
    }

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

    // Завантажуємо файли в Cloudinary якщо вони є
    let fileAttachments: string[] = [];
    if (files && files.length > 0) {
      try {
        fileAttachments = await Promise.all(
          files.map(file => 
            uploadBufferToCloudinary(file.buffer, 'homework-files', 'auto')
          )
        );
        console.log('Files uploaded successfully:', fileAttachments);
      } catch (error) {
        console.error('Failed to upload files:', error);
        throw new BadRequestException(`Помилка завантаження файлів: ${error.message}`);
      }
    }

    // Перевіряємо чи вже існує подання для цього уроку
    const existingHomework = await this.homeworkModel.findOne({
      userId,
      moduleId: dto.moduleId,
      lessonNumber: lessonNumber,
    });

    if (existingHomework) {
      // Оновлюємо існуюче подання
      existingHomework.answer = dto.answer;
      existingHomework.attachments = attachments;
      existingHomework.fileAttachments = fileAttachments;
      existingHomework.status = 'pending';
      existingHomework.submittedAt = new Date();
      existingHomework.curatorId = user.curatorId;
      // Скидаємо попередню оцінку та відгуки
      existingHomework.score = undefined;
      existingHomework.feedback = undefined;
      existingHomework.audioFeedback = undefined;
      existingHomework.reviewedAt = undefined;
      
      await existingHomework.save();
      return existingHomework;
    }

    // Створюємо нове подання
    const homework = new this.homeworkModel({
      userId,
      moduleId: dto.moduleId,
      lessonNumber: lessonNumber,
      answer: dto.answer,
      attachments: attachments,
      fileAttachments: fileAttachments,
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
    }).lean();

    if (!homework) {
      return null;
    }

    // Додаємо інформацію про модуль
    const module = await this.moduleModel.findById(homework.moduleId);
    
    return {
      id: homework._id,
      moduleId: homework.moduleId,
      moduleTitle: module?.title || 'Невідомий модуль',
      moduleNumber: module?.number || 0,
      lessonNumber: homework.lessonNumber,
      answer: homework.answer,
      attachments: homework.attachments,
      fileAttachments: homework.fileAttachments,
      status: homework.status,
      score: homework.score,
      feedback: homework.feedback,
      audioFeedback: homework.audioFeedback,
      submittedAt: homework.submittedAt,
      reviewedAt: homework.reviewedAt,
    };
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
          fileAttachments: hw.fileAttachments,
          status: hw.status,
          score: hw.score,
          feedback: hw.feedback,
          audioFeedback: hw.audioFeedback,
          submittedAt: hw.submittedAt,
          reviewedAt: hw.reviewedAt,
        };
      }),
    );

    return homeworksWithDetails;
  }
}
