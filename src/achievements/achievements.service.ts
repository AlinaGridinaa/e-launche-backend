import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserAchievement, UserAchievementDocument, ACHIEVEMENT_TYPES, AchievementType } from '../schemas/achievement.schema';
import { User, UserDocument } from '../schemas/user.schema';

export interface SubmitAchievementDto {
  achievementId: string;
  proofText?: string;
  proofFile?: string;
  proofLink?: string;
}

@Injectable()
export class AchievementsService {
  constructor(
    @InjectModel(UserAchievement.name) private userAchievementModel: Model<UserAchievementDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // Отримати всі типи нагород
  getAllAchievementTypes(): AchievementType[] {
    return ACHIEVEMENT_TYPES;
  }

  // Отримати нагороди користувача
  async getUserAchievements(userId: string) {
    const userAchievements = await this.userAchievementModel.find({ userId }).exec();
    
    return ACHIEVEMENT_TYPES.map(type => {
      const userAchievement = userAchievements.find(ua => ua.achievementId === type.id);
      return {
        ...type,
        isUnlocked: userAchievement?.status === 'approved',
        isPending: userAchievement?.status === 'pending',
        isRejected: userAchievement?.status === 'rejected',
        submittedAt: userAchievement?.submittedAt,
        approvedAt: userAchievement?.approvedAt,
        curatorComment: userAchievement?.curatorComment,
        userAchievementId: userAchievement?._id,
      };
    });
  }

  // Відправити заявку на нагороду
  async submitAchievement(userId: string, dto: SubmitAchievementDto) {
    // Перевіряємо, чи існує такий тип нагороди
    const achievementType = ACHIEVEMENT_TYPES.find(at => at.id === dto.achievementId);
    if (!achievementType) {
      throw new NotFoundException('Тип нагороди не знайдено');
    }

    // Перевіряємо, чи вже є заявка на цю нагороду
    const existing = await this.userAchievementModel.findOne({
      userId,
      achievementId: dto.achievementId,
    }).exec();

    if (existing && existing.status === 'approved') {
      throw new Error('Ви вже отримали цю нагороду');
    }

    if (existing && existing.status === 'pending') {
      throw new Error('Ваша заявка вже на розгляді');
    }

    // Створюємо або оновлюємо заявку
    if (existing) {
      existing.proofText = dto.proofText;
      existing.proofFile = dto.proofFile;
      existing.proofLink = dto.proofLink;
      existing.status = 'pending';
      existing.submittedAt = new Date();
      existing.curatorComment = undefined;
      return existing.save();
    } else {
      const newAchievement = new this.userAchievementModel({
        userId,
        achievementId: dto.achievementId,
        proofText: dto.proofText,
        proofFile: dto.proofFile,
        proofLink: dto.proofLink,
        status: 'pending',
      });
      return newAchievement.save();
    }
  }

  // Схвалити нагороду (для куратора)
  async approveAchievement(achievementId: string, curatorComment?: string) {
    const achievement = await this.userAchievementModel.findById(achievementId).exec();
    if (!achievement) {
      throw new NotFoundException('Заявку не знайдено');
    }

    achievement.status = 'approved';
    achievement.approvedAt = new Date();
    if (curatorComment) {
      achievement.curatorComment = curatorComment;
    }

    return achievement.save();
  }

  // Відхилити нагороду (для куратора)
  async rejectAchievement(achievementId: string, curatorComment: string) {
    const achievement = await this.userAchievementModel.findById(achievementId).exec();
    if (!achievement) {
      throw new NotFoundException('Заявку не знайдено');
    }

    achievement.status = 'rejected';
    achievement.curatorComment = curatorComment;

    return achievement.save();
  }

  // Отримати всі заявки на нагороди (для куратора)
  async getAllPendingAchievements() {
    const achievements = await this.userAchievementModel
      .find({ status: 'pending' })
      .populate('userId', 'firstName lastName email')
      .sort({ submittedAt: -1 })
      .exec();

    return achievements.map(achievement => {
      const type = ACHIEVEMENT_TYPES.find(at => at.id === achievement.achievementId);
      return {
        ...achievement.toObject(),
        achievementType: type,
      };
    });
  }
}
