import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Module, ModuleDocument } from '../schemas/module.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { getAvatarForLevel } from '../config/avatars.config';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Module.name) private moduleModel: Model<ModuleDocument>,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .select('-password')
      .exec();

    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    // Підрахунок реальної статистики
    const modules = await this.moduleModel.find().exec();
    const totalModules = modules.length;
    const totalLessons = modules.reduce((sum, module) => sum + module.lessons.length, 0);
    
    const modulesCompleted = user.completedModules?.length || 0;
    const completedLessons = user.completedLessons?.length || 0;
    const earnings = user.earnings || 0;

    // Підрахунок рангу (місце серед всіх користувачів за earnings)
    const allUsers = await this.userModel
      .find()
      .select('earnings')
      .sort({ earnings: -1 })
      .exec();
    
    const rank = allUsers.findIndex(u => u._id.toString() === userId) + 1;

    const stats = {
      modulesCompleted,
      totalModules,
      lessonsCompleted: completedLessons,
      totalLessons,
      earnings,
      rank: rank || 1,
    };

    // Отримуємо правильний аватар на основі кількості пройдених модулів
    const avatarUrl = getAvatarForLevel(modulesCompleted);
    const userObject = user.toObject();
    userObject.avatarUrl = avatarUrl;
    userObject.currentAvatarLevel = modulesCompleted;

    return {
      user: userObject,
      stats,
    };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.userModel
      .findByIdAndUpdate(userId, updateProfileDto, { new: true })
      .select('-password')
      .exec();

    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    return user;
  }

  async updateAvatar(userId: string, avatarUrl: string) {
    const user = await this.userModel
      .findByIdAndUpdate(userId, { avatarUrl }, { new: true })
      .select('-password')
      .exec();

    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    return {
      success: true,
      avatarUrl: user.avatarUrl,
      user: user.toObject(),
    };
  }

  async getEarnings(userId: string) {
    const user = await this.userModel.findById(userId).select('earningsHistory earnings').exec();
    
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    return {
      totalEarnings: user.earnings || 0,
      history: user.earningsHistory || [],
    };
  }

  async addEarning(userId: string, earningData: { amount: number; date: string; description?: string }) {
    const user = await this.userModel.findById(userId).exec();
    
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    if (!user.earningsHistory) {
      user.earningsHistory = [];
    }

    user.earningsHistory.push({
      amount: earningData.amount,
      date: new Date(earningData.date),
      description: earningData.description,
      createdAt: new Date(),
    });

    // Оновлюємо загальний дохід
    user.earnings = (user.earnings || 0) + earningData.amount;

    await user.save();

    return {
      success: true,
      message: 'Дохід додано успішно',
      totalEarnings: user.earnings,
      history: user.earningsHistory,
    };
  }

  async deleteEarning(userId: string, earningId: string) {
    const user = await this.userModel.findById(userId).exec();
    
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    const earning = user.earningsHistory?.find(e => e._id?.toString() === earningId);
    
    if (!earning) {
      throw new NotFoundException('Запис про дохід не знайдено');
    }

    // Віднімаємо суму з загального доходу
    user.earnings = (user.earnings || 0) - earning.amount;

    // Видаляємо запис
    user.earningsHistory = user.earningsHistory?.filter(e => e._id?.toString() !== earningId) || [];

    await user.save();

    return {
      success: true,
      message: 'Дохід видалено успішно',
      totalEarnings: user.earnings,
      history: user.earningsHistory,
    };
  }

  async getLeaderboard(currentUserId: string) {
    // Отримуємо всіх користувачів з доходом > 0, сортуємо за earnings
    const topUsers = await this.userModel
      .find({ earnings: { $gt: 0 } })
      .select('firstName lastName earnings')
      .sort({ earnings: -1 })
      .limit(10)
      .exec();

    // Отримуємо поточного користувача
    const currentUser = await this.userModel
      .findById(currentUserId)
      .select('firstName lastName earnings')
      .exec();

    if (!currentUser) {
      throw new NotFoundException('Користувача не знайдено');
    }

    // Підраховуємо ранг поточного користувача
    const allUsersCount = await this.userModel.countDocuments({ earnings: { $gte: currentUser.earnings } }).exec();
    const currentUserRank = allUsersCount;

    // Формуємо рейтинг
    const leaderboard = topUsers.map((user, index) => ({
      rank: index + 1,
      name: `${user.firstName} ${user.lastName}`,
      earnings: user.earnings,
      isCurrentUser: user._id.toString() === currentUserId,
    }));

    // Якщо поточний користувач не в топ-10, додаємо його окремо
    const currentUserInTop = leaderboard.find(u => u.isCurrentUser);
    if (!currentUserInTop && currentUser.earnings > 0) {
      leaderboard.push({
        rank: currentUserRank,
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        earnings: currentUser.earnings,
        isCurrentUser: true,
      });
    }

    return leaderboard;
  }
}
