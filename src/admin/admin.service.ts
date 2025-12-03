import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Module, ModuleDocument } from '../schemas/module.schema';
import { AvatarLevel, AvatarLevelDocument } from '../schemas/avatar-level.schema';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { AwardAchievementDto } from './dto/award-achievement.dto';
import { getAvatarForLevel, setAvatarCache, clearAvatarCache } from '../config/avatars.config';
import { uploadToCloudinary } from '../config/cloudinary.config';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Module.name) private moduleModel: Model<ModuleDocument>,
    @InjectModel(AvatarLevel.name) private avatarLevelModel: Model<AvatarLevelDocument>,
    private notificationsService: NotificationsService,
  ) {
    // Завантажуємо аватари в кеш при старті
    this.loadAvatarsToCache();
  }

  private async loadAvatarsToCache() {
    try {
      const avatars = await this.avatarLevelModel.find().sort({ level: 1 });
      const avatarMap: Record<number, string> = {};
      avatars.forEach(avatar => {
        avatarMap[avatar.level] = avatar.imageUrl;
      });
      setAvatarCache(avatarMap);
    } catch (error) {
      console.error('Failed to load avatars to cache:', error);
    }
  }

  async uploadAvatarToCloudinary(filePath: string): Promise<string> {
    try {
      const imageUrl = await uploadToCloudinary(filePath, 'avatars');
      return imageUrl;
    } catch (error) {
      console.error('Failed to upload avatar to Cloudinary:', error);
      throw new Error('Не вдалося завантажити аватар в Cloudinary');
    }
  }

  async getAllUsers() {
    const users = await this.userModel
      .find()
      .select('-password')
      .sort({ createdAt: -1 });

    return users.map(user => ({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneOrTelegram: user.phoneOrTelegram,
      group: user.group,
      accessUntil: user.accessUntil,
      tariff: user.tariff,
      faculty: user.faculty,
      isAdmin: user.isAdmin,
      isCurator: user.isCurator,
      curatorId: user.curatorId,
      earnings: user.earnings,
      completedLessonsCount: user.completedLessons?.length || 0,
      completedModulesCount: user.completedModules?.length || 0,
    }));
  }

  async updateUser(userId: string, updateData: Partial<CreateUserDto>) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    // Перевіряємо чи email вже використовується іншим користувачем
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await this.userModel.findOne({ email: updateData.email });
      if (existingUser) {
        throw new ConflictException('Користувач з таким email вже існує');
      }
      user.email = updateData.email;
    }

    // Оновлюємо дозволені поля
    if (updateData.firstName !== undefined) user.firstName = updateData.firstName;
    if (updateData.lastName !== undefined) user.lastName = updateData.lastName;
    if (updateData.phoneOrTelegram !== undefined) user.phoneOrTelegram = updateData.phoneOrTelegram;
    if (updateData.group !== undefined) user.group = updateData.group;
    if (updateData.accessUntil !== undefined) {
      user.accessUntil = updateData.accessUntil ? new Date(updateData.accessUntil) : undefined;
    }
    if (updateData.tariff !== undefined) user.tariff = updateData.tariff;
    if (updateData.faculty !== undefined) user.faculty = updateData.faculty;

    await user.save();

    return {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneOrTelegram: user.phoneOrTelegram,
      group: user.group,
      accessUntil: user.accessUntil,
      tariff: user.tariff,
      faculty: user.faculty,
    };
  }

  async assignFaculty(userId: string, faculty: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    user.faculty = faculty;
    await user.save();

    return {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      faculty: user.faculty,
    };
  }

  async toggleAdmin(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    user.isAdmin = !user.isAdmin;
    await user.save();

    return {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    };
  }

  async getStats() {
    const totalUsers = await this.userModel.countDocuments();
    const modules = await this.moduleModel.find();
    const totalModules = modules.length;
    const totalLessons = modules.reduce((sum, module) => sum + (module.lessons?.length || 0), 0);
    
    // Підрахунок активних користувачів (тих, хто має хоча б 1 завершений урок)
    const activeUsers = await this.userModel.countDocuments({
      $expr: { $gt: [{ $size: { $ifNull: ['$completedLessons', []] } }, 0] }
    });

    return {
      totalUsers,
      totalModules,
      totalLessons,
      activeUsers,
    };
  }

  async createUser(createUserDto: CreateUserDto) {
    // Перевіряємо чи існує користувач з таким email
    const existingUser = await this.userModel.findOne({ email: createUserDto.email });
    if (existingUser) {
      throw new ConflictException('Користувач з таким email вже існує');
    }

    // Хешуємо пароль
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Створюємо нового користувача
    const newUser = new this.userModel({
      email: createUserDto.email,
      password: hashedPassword,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      phoneOrTelegram: createUserDto.phoneOrTelegram || null,
      group: createUserDto.group || null,
      accessUntil: createUserDto.accessUntil ? new Date(createUserDto.accessUntil) : null,
      tariff: createUserDto.tariff || null,
      faculty: createUserDto.faculty || null,
      isAdmin: createUserDto.isAdmin || false,
      isCurator: createUserDto.isCurator || false,
      earnings: 0,
      completedLessons: [],
      completedModules: [],
      currentAvatarLevel: 0,
      avatarUrl: getAvatarForLevel(0),
    });

    await newUser.save();

    // Повертаємо користувача без пароля
    return {
      id: newUser._id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phoneOrTelegram: newUser.phoneOrTelegram,
      group: newUser.group,
      accessUntil: newUser.accessUntil,
      tariff: newUser.tariff,
      faculty: newUser.faculty,
      isAdmin: newUser.isAdmin,
      isCurator: newUser.isCurator,
      earnings: newUser.earnings,
    };
  }

  async awardAchievement(userId: string, achievementDto: AwardAchievementDto) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    const newAchievement = {
      title: achievementDto.title,
      description: achievementDto.description,
      imageUrl: achievementDto.imageUrl,
      awardedAt: new Date(),
    };

    if (!user.achievements) {
      user.achievements = [];
    }

    user.achievements.push(newAchievement);
    await user.save();

    return {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      achievements: user.achievements,
    };
  }

  async getUserAchievements(userId: string) {
    const user = await this.userModel.findById(userId).select('achievements firstName lastName');
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    return {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      achievements: user.achievements || [],
    };
  }

  async removeAchievement(userId: string, achievementId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    if (!user.achievements) {
      user.achievements = [];
    }

    user.achievements = user.achievements.filter(
      achievement => achievement._id?.toString() !== achievementId
    );

    await user.save();

    return {
      id: user._id,
      achievements: user.achievements,
    };
  }

  async toggleCurator(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    user.isCurator = !user.isCurator;
    await user.save();

    return {
      id: user._id,
      email: user.email,
      isCurator: user.isCurator,
    };
  }

  async assignCurator(userId: string, curatorId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    // Перевірити що куратор існує
    const curator = await this.userModel.findById(curatorId);
    if (!curator || !curator.isCurator) {
      throw new NotFoundException('Куратора не знайдено');
    }

    user.curatorId = curatorId;
    await user.save();

    return {
      id: user._id,
      curatorId: user.curatorId,
      curatorName: `${curator.firstName} ${curator.lastName}`,
    };
  }

  async getAllCurators() {
    const curators = await this.userModel
      .find({ isCurator: true })
      .select('firstName lastName email')
      .sort({ firstName: 1 });

    return curators.map(curator => ({
      id: curator._id,
      name: `${curator.firstName} ${curator.lastName}`,
      email: curator.email,
    }));
  }

  // ===== MODULES MANAGEMENT =====

  async getAllModules() {
    const modules = await this.moduleModel.find().sort({ number: 1 });
    return modules.map(module => ({
      id: module._id,
      number: module.number,
      title: module.title,
      description: module.description,
      isLocked: module.isLocked,
      unlockDate: module.unlockDate,
      category: module.category,
      lessonsCount: module.lessons?.length || 0,
    }));
  }

  async getModuleById(moduleId: string) {
    const module = await this.moduleModel.findById(moduleId);
    if (!module) {
      throw new NotFoundException('Модуль не знайдено');
    }
    return module;
  }

  async createModule(moduleData: {
    number: number;
    title: string;
    description?: string;
    category?: string;
    isLocked?: boolean;
    unlockDate?: Date;
  }) {
    // Перевірка чи існує модуль з таким номером
    const existingModule = await this.moduleModel.findOne({ number: moduleData.number });
    if (existingModule) {
      throw new ConflictException(`Модуль з номером ${moduleData.number} вже існує`);
    }

    const newModule = new this.moduleModel({
      ...moduleData,
      lessons: [],
      progress: 0,
    });

    await newModule.save();
    return newModule;
  }

  async updateModule(moduleId: string, updateData: {
    number?: number;
    title?: string;
    description?: string;
    category?: string;
    isLocked?: boolean;
    unlockDate?: Date;
  }) {
    const module = await this.moduleModel.findById(moduleId);
    if (!module) {
      throw new NotFoundException('Модуль не знайдено');
    }

    // Якщо змінюється номер, перевірити чи не зайнятий
    if (updateData.number && updateData.number !== module.number) {
      const existingModule = await this.moduleModel.findOne({ number: updateData.number });
      if (existingModule) {
        throw new ConflictException(`Модуль з номером ${updateData.number} вже існує`);
      }
    }

    Object.assign(module, updateData);
    await module.save();
    return module;
  }

  async deleteModule(moduleId: string) {
    const module = await this.moduleModel.findById(moduleId);
    if (!module) {
      throw new NotFoundException('Модуль не знайдено');
    }

    await this.moduleModel.deleteOne({ _id: moduleId });
    return { success: true, message: 'Модуль видалено' };
  }

  async toggleModuleLock(moduleId: string) {
    const module = await this.moduleModel.findById(moduleId);
    if (!module) {
      throw new NotFoundException('Модуль не знайдено');
    }

    module.isLocked = !module.isLocked;
    await module.save();

    return {
      id: module._id,
      isLocked: module.isLocked,
    };
  }

  // ===== LESSONS MANAGEMENT =====

  async createLesson(moduleId: string, lessonData: {
    number: number;
    title: string;
    description?: string;
    videoUrl?: string;
    homework?: string;
    duration?: number;
  }) {
    const module = await this.moduleModel.findById(moduleId);
    if (!module) {
      throw new NotFoundException('Модуль не знайдено');
    }

    // Перевірка чи існує урок з таким номером в модулі
    const existingLesson = module.lessons.find(l => l.number === lessonData.number);
    if (existingLesson) {
      throw new ConflictException(`Урок з номером ${lessonData.number} вже існує в цьому модулі`);
    }

    const newLesson = {
      number: lessonData.number,
      title: lessonData.title,
      description: lessonData.description || '',
      videoUrl: lessonData.videoUrl || '',
      homework: lessonData.homework || '',
      duration: lessonData.duration || 0,
      materials: [],
      isCompleted: false,
    };

    module.lessons.push(newLesson);
    await module.save();

    return newLesson;
  }

  async updateLesson(moduleId: string, lessonNumber: number, updateData: {
    title?: string;
    description?: string;
    videoUrl?: string;
    homework?: string;
    duration?: number;
  }) {
    const module = await this.moduleModel.findById(moduleId);
    if (!module) {
      throw new NotFoundException('Модуль не знайдено');
    }

    const lesson = module.lessons.find(l => l.number === lessonNumber);
    if (!lesson) {
      throw new NotFoundException('Урок не знайдено');
    }

    Object.assign(lesson, updateData);
    await module.save();

    return lesson;
  }

  async deleteLesson(moduleId: string, lessonNumber: number) {
    const module = await this.moduleModel.findById(moduleId);
    if (!module) {
      throw new NotFoundException('Модуль не знайдено');
    }

    const lessonIndex = module.lessons.findIndex(l => l.number === lessonNumber);
    if (lessonIndex === -1) {
      throw new NotFoundException('Урок не знайдено');
    }

    module.lessons.splice(lessonIndex, 1);
    await module.save();

    return { success: true, message: 'Урок видалено' };
  }

  async addLessonMaterial(moduleId: string, lessonNumber: number, materialData: {
    type: string;
    title: string;
    url: string;
  }) {
    const module = await this.moduleModel.findById(moduleId);
    if (!module) {
      throw new NotFoundException('Модуль не знайдено');
    }

    const lesson = module.lessons.find(l => l.number === lessonNumber);
    if (!lesson) {
      throw new NotFoundException('Урок не знайдено');
    }

    if (!lesson.materials) {
      lesson.materials = [];
    }

    lesson.materials.push(materialData);
    await module.save();

    return lesson;
  }

  async deleteLessonMaterial(moduleId: string, lessonNumber: number, materialIndex: number) {
    const module = await this.moduleModel.findById(moduleId);
    if (!module) {
      throw new NotFoundException('Модуль не знайдено');
    }

    const lesson = module.lessons.find(l => l.number === lessonNumber);
    if (!lesson) {
      throw new NotFoundException('Урок не знайдено');
    }

    if (!lesson.materials || materialIndex >= lesson.materials.length) {
      throw new NotFoundException('Матеріал не знайдено');
    }

    lesson.materials.splice(materialIndex, 1);
    await module.save();

    return lesson;
  }

  // ===== AVATAR LEVELS MANAGEMENT =====

  async getAllAvatarLevels() {
    return this.avatarLevelModel.find().sort({ level: 1 });
  }

  async getAvatarLevel(level: number) {
    const avatar = await this.avatarLevelModel.findOne({ level });
    if (!avatar) {
      throw new NotFoundException(`Аватар для рівня ${level} не знайдено`);
    }
    return avatar;
  }

  async setAvatarLevel(level: number, imageUrl: string, description?: string) {
    const existingAvatar = await this.avatarLevelModel.findOne({ level });

    if (existingAvatar) {
      // Оновлюємо існуючий
      existingAvatar.imageUrl = imageUrl;
      if (description !== undefined) {
        existingAvatar.description = description;
      }
      await existingAvatar.save();
      
      // Оновлюємо кеш
      await this.loadAvatarsToCache();
      
      return existingAvatar;
    } else {
      // Створюємо новий
      const newAvatar = await this.avatarLevelModel.create({
        level,
        imageUrl,
        description,
      });
      
      // Оновлюємо кеш
      await this.loadAvatarsToCache();
      
      return newAvatar;
    }
  }

  async deleteAvatarLevel(level: number) {
    const avatar = await this.avatarLevelModel.findOneAndDelete({ level });
    if (!avatar) {
      throw new NotFoundException(`Аватар для рівня ${level} не знайдено`);
    }
    
    // Оновлюємо кеш
    await this.loadAvatarsToCache();
    
    return { message: `Аватар для рівня ${level} видалено` };
  }

  async initializeDefaultAvatars() {
    // Перевіряємо, чи вже є аватари
    const existingCount = await this.avatarLevelModel.countDocuments();
    if (existingCount > 0) {
      return { message: 'Аватари вже ініціалізовані', count: existingCount };
    }

    // Створюємо дефолтні аватари
    const defaultAvatars: Array<{ level: number; imageUrl: string; description: string }> = [];
    for (let i = 0; i <= 10; i++) {
      defaultAvatars.push({
        level: i,
        imageUrl: `/avatars/level-${i}.png`,
        description: i === 0 ? 'Початковий аватар' : `Аватар після ${i} модуля`,
      });
    }

    await this.avatarLevelModel.insertMany(defaultAvatars);
    
    // Оновлюємо кеш
    await this.loadAvatarsToCache();

    return { message: 'Дефолтні аватари створено', count: 11 };
  }

  // Статистика оцінок уроків
  async getLessonRatingsStatistics(moduleId?: string) {
    const users = await this.userModel.find().select('completedLessons firstName lastName email').exec();
    
    const ratings: Array<{
      userId: any;
      userEmail: string;
      userName: string;
      moduleId: string;
      lessonNumber: number;
      moodRating?: number;
      usefulnessRating?: number;
      completedAt: Date;
    }> = [];
    
    for (const user of users) {
      if (!user.completedLessons || user.completedLessons.length === 0) continue;
      
      for (const lesson of user.completedLessons) {
        // Фільтруємо за moduleId якщо вказано
        if (moduleId && lesson.moduleId !== moduleId) continue;
        
        // Додаємо тільки якщо є оцінки
        if (lesson.moodRating || lesson.usefulnessRating) {
          ratings.push({
            userId: user._id,
            userEmail: user.email,
            userName: `${user.firstName} ${user.lastName}`,
            moduleId: lesson.moduleId,
            lessonNumber: lesson.lessonNumber,
            moodRating: lesson.moodRating,
            usefulnessRating: lesson.usefulnessRating,
            completedAt: lesson.completedAt,
          });
        }
      }
    }
    
    return ratings;
  }

  async sendCustomNotification(
    title: string,
    message: string,
    url: string | undefined,
    sendToAll: boolean,
    userIds: string[] | undefined,
  ): Promise<{ sent: number; failed: number }> {
    const payload = {
      title,
      body: message,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: url ? { url } : undefined,
    };

    if (sendToAll) {
      // Відправити всім користувачам
      const result = await this.notificationsService.sendNotificationToAll(payload);
      return { sent: result.sent, failed: result.failed };
    } else if (userIds && userIds.length > 0) {
      // Відправити вибраним користувачам
      let totalSent = 0;
      let totalFailed = 0;

      for (const userId of userIds) {
        try {
          const result = await this.notificationsService.sendNotificationToUser(userId, payload);
          totalSent += result.sent;
          totalFailed += result.failed;
        } catch (error) {
          console.error(`Failed to send notification to user ${userId}:`, error);
          totalFailed++;
        }
      }

      return { sent: totalSent, failed: totalFailed };
    } else {
      throw new Error('Потрібно вказати або sendToAll=true, або список userIds');
    }
  }
}
