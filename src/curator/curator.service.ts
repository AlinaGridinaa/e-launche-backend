import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Homework, HomeworkDocument } from '../schemas/homework.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { Module as ModuleEntity, ModuleDocument } from '../schemas/module.schema';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CuratorService {
  constructor(
    @InjectModel(Homework.name) private homeworkModel: Model<HomeworkDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(ModuleEntity.name) private moduleModel: Model<ModuleDocument>,
    private notificationsService: NotificationsService,
  ) {}

  // Отримати всі домашні завдання для куратора
  async getHomeworksForCurator(curatorId: string) {
    // Знайти всіх студентів куратора
    const students = await this.userModel.find({ curatorId }).select('_id firstName lastName');
    const studentIds = students.map(s => s._id.toString());

    // Знайти всі домашні завдання цих студентів
    const homeworks = await this.homeworkModel
      .find({ userId: { $in: studentIds } })
      .sort({ submittedAt: -1 });

    // Збагатити дані інформацією про студентів та модулі
    const enrichedHomeworks = await Promise.all(
      homeworks.map(async (homework) => {
        const student = students.find(s => s._id.toString() === homework.userId);
        const module = await this.moduleModel.findById(homework.moduleId).select('title number');
        
        return {
          id: homework._id,
          studentId: homework.userId,
          studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown',
          moduleId: homework.moduleId,
          moduleTitle: module?.title || 'Unknown Module',
          moduleNumber: module?.number,
          lessonNumber: homework.lessonNumber,
          answer: homework.answer,
          attachments: homework.attachments,
          status: homework.status,
          score: homework.score,
          feedback: homework.feedback,
          submittedAt: homework.submittedAt,
          reviewedAt: homework.reviewedAt,
        };
      })
    );

    return enrichedHomeworks;
  }

  // Перевірити домашнє завдання
  async reviewHomework(
    curatorId: string,
    homeworkId: string,
    score?: number,
    feedback?: string,
  ) {
    const homework = await this.homeworkModel.findById(homeworkId);
    if (!homework) {
      throw new NotFoundException('Домашнє завдання не знайдено');
    }

    // Перевірити, що студент належить цьому куратору
    const student = await this.userModel.findById(homework.userId);
    if (!student || student.curatorId !== curatorId) {
      throw new ForbiddenException('Це не ваш студент');
    }

    // Отримати інформацію про модуль для нотифікації
    const module = await this.moduleModel.findById(homework.moduleId);
    const lessonTitle = module 
      ? `${module.title} - Урок ${homework.lessonNumber}`
      : `Урок ${homework.lessonNumber}`;

    homework.curatorId = curatorId;
    if (score !== undefined && score !== null) {
      homework.score = score;
    }
    homework.feedback = feedback;
    homework.status = 'reviewed';
    homework.reviewedAt = new Date();

    await homework.save();

    // Відправити пуш-нотифікацію студенту
    try {
      const notificationBody = score !== undefined && score !== null
        ? `${lessonTitle}: оцінка ${score}/100`
        : `${lessonTitle}: перевірено`;
      
      await this.notificationsService.sendNotificationToUser(homework.userId, {
        title: '✅ Домашнє завдання перевірено',
        body: notificationBody,
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        data: { 
          url: `/modules/${homework.moduleId}/lessons/${homework.lessonNumber}`,
          homeworkId: homework._id.toString(),
        },
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
      // Не кидаємо помилку, щоб перевірка ДЗ пройшла успішно навіть якщо нотифікація не відправилася
    }

    return {
      id: homework._id,
      score: homework.score,
      feedback: homework.feedback,
      status: homework.status,
      reviewedAt: homework.reviewedAt,
    };
  }

  // Повернути домашнє завдання на доопрацювання
  async returnForRevision(
    curatorId: string,
    homeworkId: string,
    feedback: string,
  ) {
    const homework = await this.homeworkModel.findById(homeworkId);
    if (!homework) {
      throw new NotFoundException('Домашнє завдання не знайдено');
    }

    // Перевірити, що студент належить цьому куратору
    const student = await this.userModel.findById(homework.userId);
    if (!student || student.curatorId !== curatorId) {
      throw new ForbiddenException('Це не ваш студент');
    }

    // Отримати інформацію про модуль для нотифікації
    const module = await this.moduleModel.findById(homework.moduleId);
    const lessonTitle = module 
      ? `${module.title} - Урок ${homework.lessonNumber}`
      : `Урок ${homework.lessonNumber}`;

    homework.curatorId = curatorId;
    homework.feedback = feedback;
    homework.status = 'needs_revision';
    homework.reviewedAt = new Date();
    homework.score = undefined; // Скидаємо оцінку

    await homework.save();

    // Відправити пуш-нотифікацію студенту
    try {
      await this.notificationsService.sendNotificationToUser(homework.userId, {
        title: '📝 Домашнє завдання потребує доопрацювання',
        body: `${lessonTitle}: ${feedback.substring(0, 80)}${feedback.length > 80 ? '...' : ''}`,
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        data: { 
          url: `/modules/${homework.moduleId}/lessons/${homework.lessonNumber}`,
          homeworkId: homework._id.toString(),
        },
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
      // Не кидаємо помилку, щоб повернення ДЗ пройшло успішно навіть якщо нотифікація не відправилася
    }

    return {
      id: homework._id,
      feedback: homework.feedback,
      status: homework.status,
      reviewedAt: homework.reviewedAt,
    };
  }

  // Отримати список студентів куратора
  async getMyStudents(curatorId: string) {
    const students = await this.userModel
      .find({ curatorId })
      .select('firstName lastName email faculty completedLessons completedModules earnings');

    return students.map(student => ({
      id: student._id,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      faculty: student.faculty,
      completedLessonsCount: student.completedLessons?.length || 0,
      completedModulesCount: student.completedModules?.length || 0,
      earnings: student.earnings,
    }));
  }

  // Отримати всі модулі (для куратора)
  async getAllModules() {
    const modules = await this.moduleModel
      .find()
      .select('number title description coverImage lessons')
      .sort({ number: 1 });

    return modules.map(module => ({
      id: module._id,
      number: module.number,
      title: module.title,
      description: module.description,
      lessonsCount: module.lessons?.length || 0,
    }));
  }
}
