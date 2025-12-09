"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../schemas/user.schema");
const module_schema_1 = require("../schemas/module.schema");
const avatar_level_schema_1 = require("../schemas/avatar-level.schema");
const bcrypt = __importStar(require("bcrypt"));
const avatars_config_1 = require("../config/avatars.config");
const cloudinary_config_1 = require("../config/cloudinary.config");
const notifications_service_1 = require("../notifications/notifications.service");
let AdminService = class AdminService {
    userModel;
    moduleModel;
    avatarLevelModel;
    notificationsService;
    constructor(userModel, moduleModel, avatarLevelModel, notificationsService) {
        this.userModel = userModel;
        this.moduleModel = moduleModel;
        this.avatarLevelModel = avatarLevelModel;
        this.notificationsService = notificationsService;
        this.loadAvatarsToCache();
    }
    async loadAvatarsToCache() {
        try {
            const avatars = await this.avatarLevelModel.find().sort({ level: 1 });
            const avatarMap = {};
            avatars.forEach(avatar => {
                avatarMap[avatar.level] = avatar.imageUrl;
            });
            (0, avatars_config_1.setAvatarCache)(avatarMap);
        }
        catch (error) {
            console.error('Failed to load avatars to cache:', error);
        }
    }
    async uploadAvatarToCloudinary(filePath) {
        try {
            const imageUrl = await (0, cloudinary_config_1.uploadToCloudinary)(filePath, 'avatars');
            return imageUrl;
        }
        catch (error) {
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
    async updateUser(userId, updateData) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Користувача не знайдено');
        }
        if (updateData.email && updateData.email.toLowerCase() !== user.email.toLowerCase()) {
            const existingUser = await this.userModel.findOne({
                email: { $regex: new RegExp(`^${updateData.email}$`, 'i') }
            });
            if (existingUser) {
                throw new common_1.ConflictException('Користувач з таким email вже існує');
            }
            user.email = updateData.email.toLowerCase();
        }
        if (updateData.firstName !== undefined)
            user.firstName = updateData.firstName;
        if (updateData.lastName !== undefined)
            user.lastName = updateData.lastName;
        if (updateData.phoneOrTelegram !== undefined)
            user.phoneOrTelegram = updateData.phoneOrTelegram;
        if (updateData.group !== undefined)
            user.group = updateData.group;
        if (updateData.accessUntil !== undefined) {
            user.accessUntil = updateData.accessUntil && updateData.accessUntil.trim() !== '' ? new Date(updateData.accessUntil) : undefined;
        }
        if (updateData.tariff !== undefined)
            user.tariff = updateData.tariff;
        if (updateData.faculty !== undefined)
            user.faculty = updateData.faculty;
        if (updateData.curatorId !== undefined)
            user.curatorId = updateData.curatorId;
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
    async changePassword(userId, password) {
        if (!password || password.length < 6) {
            throw new common_1.ConflictException('Пароль має бути не менше 6 символів');
        }
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Користувача не знайдено');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();
        return {
            success: true,
            message: 'Пароль успішно змінено',
        };
    }
    async deleteUser(userId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Користувача не знайдено');
        }
        await this.userModel.deleteOne({ _id: userId });
        return {
            success: true,
            message: 'Користувача видалено',
        };
    }
    async assignFaculty(userId, faculty) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Користувача не знайдено');
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
    async toggleAdmin(userId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Користувача не знайдено');
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
    async createUser(createUserDto) {
        const existingUser = await this.userModel.findOne({
            email: { $regex: new RegExp(`^${createUserDto.email}$`, 'i') }
        });
        if (existingUser) {
            throw new common_1.ConflictException('Користувач з таким email вже існує');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const newUser = new this.userModel({
            email: createUserDto.email.toLowerCase(),
            password: hashedPassword,
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            phoneOrTelegram: createUserDto.phoneOrTelegram || null,
            group: createUserDto.group || null,
            accessUntil: createUserDto.accessUntil && createUserDto.accessUntil.trim() !== '' ? new Date(createUserDto.accessUntil) : undefined,
            tariff: createUserDto.tariff || null,
            faculty: createUserDto.faculty || null,
            curatorId: createUserDto.curatorId || null,
            isAdmin: createUserDto.isAdmin || false,
            isCurator: createUserDto.isCurator || false,
            earnings: 0,
            completedLessons: [],
            completedModules: [],
            currentAvatarLevel: 0,
            avatarUrl: (0, avatars_config_1.getAvatarForLevel)(0),
        });
        await newUser.save();
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
    async awardAchievement(userId, achievementDto) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Користувача не знайдено');
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
    async getUserAchievements(userId) {
        const user = await this.userModel.findById(userId).select('achievements firstName lastName');
        if (!user) {
            throw new common_1.NotFoundException('Користувача не знайдено');
        }
        return {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            achievements: user.achievements || [],
        };
    }
    async removeAchievement(userId, achievementId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Користувача не знайдено');
        }
        if (!user.achievements) {
            user.achievements = [];
        }
        user.achievements = user.achievements.filter(achievement => achievement._id?.toString() !== achievementId);
        await user.save();
        return {
            id: user._id,
            achievements: user.achievements,
        };
    }
    async toggleCurator(userId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Користувача не знайдено');
        }
        user.isCurator = !user.isCurator;
        await user.save();
        return {
            id: user._id,
            email: user.email,
            isCurator: user.isCurator,
        };
    }
    async assignCurator(userId, curatorId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Користувача не знайдено');
        }
        const curator = await this.userModel.findById(curatorId);
        if (!curator || !curator.isCurator) {
            throw new common_1.NotFoundException('Куратора не знайдено');
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
    async getModuleById(moduleId) {
        const module = await this.moduleModel.findById(moduleId);
        if (!module) {
            throw new common_1.NotFoundException('Модуль не знайдено');
        }
        return module;
    }
    async createModule(moduleData) {
        const existingModule = await this.moduleModel.findOne({ number: moduleData.number });
        if (existingModule) {
            throw new common_1.ConflictException(`Модуль з номером ${moduleData.number} вже існує`);
        }
        const newModule = new this.moduleModel({
            ...moduleData,
            lessons: [],
            progress: 0,
        });
        await newModule.save();
        return newModule;
    }
    async updateModule(moduleId, updateData) {
        const module = await this.moduleModel.findById(moduleId);
        if (!module) {
            throw new common_1.NotFoundException('Модуль не знайдено');
        }
        if (updateData.number && updateData.number !== module.number) {
            const existingModule = await this.moduleModel.findOne({ number: updateData.number });
            if (existingModule) {
                throw new common_1.ConflictException(`Модуль з номером ${updateData.number} вже існує`);
            }
        }
        Object.assign(module, updateData);
        await module.save();
        return module;
    }
    async deleteModule(moduleId) {
        const module = await this.moduleModel.findById(moduleId);
        if (!module) {
            throw new common_1.NotFoundException('Модуль не знайдено');
        }
        await this.moduleModel.deleteOne({ _id: moduleId });
        return { success: true, message: 'Модуль видалено' };
    }
    async toggleModuleLock(moduleId) {
        const module = await this.moduleModel.findById(moduleId);
        if (!module) {
            throw new common_1.NotFoundException('Модуль не знайдено');
        }
        module.isLocked = !module.isLocked;
        await module.save();
        return {
            id: module._id,
            isLocked: module.isLocked,
        };
    }
    async createLesson(moduleId, lessonData) {
        const module = await this.moduleModel.findById(moduleId);
        if (!module) {
            throw new common_1.NotFoundException('Модуль не знайдено');
        }
        const existingLesson = module.lessons.find(l => l.number === lessonData.number);
        if (existingLesson) {
            throw new common_1.ConflictException(`Урок з номером ${lessonData.number} вже існує в цьому модулі`);
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
    async updateLesson(moduleId, lessonNumber, updateData) {
        const module = await this.moduleModel.findById(moduleId);
        if (!module) {
            throw new common_1.NotFoundException('Модуль не знайдено');
        }
        const lesson = module.lessons.find(l => l.number === lessonNumber);
        if (!lesson) {
            throw new common_1.NotFoundException('Урок не знайдено');
        }
        Object.assign(lesson, updateData);
        await module.save();
        return lesson;
    }
    async deleteLesson(moduleId, lessonNumber) {
        const module = await this.moduleModel.findById(moduleId);
        if (!module) {
            throw new common_1.NotFoundException('Модуль не знайдено');
        }
        const lessonIndex = module.lessons.findIndex(l => l.number === lessonNumber);
        if (lessonIndex === -1) {
            throw new common_1.NotFoundException('Урок не знайдено');
        }
        module.lessons.splice(lessonIndex, 1);
        await module.save();
        return { success: true, message: 'Урок видалено' };
    }
    async addLessonMaterial(moduleId, lessonNumber, materialData) {
        const module = await this.moduleModel.findById(moduleId);
        if (!module) {
            throw new common_1.NotFoundException('Модуль не знайдено');
        }
        const lesson = module.lessons.find(l => l.number === lessonNumber);
        if (!lesson) {
            throw new common_1.NotFoundException('Урок не знайдено');
        }
        if (!lesson.materials) {
            lesson.materials = [];
        }
        lesson.materials.push(materialData);
        await module.save();
        return lesson;
    }
    async deleteLessonMaterial(moduleId, lessonNumber, materialIndex) {
        const module = await this.moduleModel.findById(moduleId);
        if (!module) {
            throw new common_1.NotFoundException('Модуль не знайдено');
        }
        const lesson = module.lessons.find(l => l.number === lessonNumber);
        if (!lesson) {
            throw new common_1.NotFoundException('Урок не знайдено');
        }
        if (!lesson.materials || materialIndex >= lesson.materials.length) {
            throw new common_1.NotFoundException('Матеріал не знайдено');
        }
        lesson.materials.splice(materialIndex, 1);
        await module.save();
        return lesson;
    }
    async getAllAvatarLevels() {
        return this.avatarLevelModel.find().sort({ level: 1 });
    }
    async getAvatarLevel(level) {
        const avatar = await this.avatarLevelModel.findOne({ level });
        if (!avatar) {
            throw new common_1.NotFoundException(`Аватар для рівня ${level} не знайдено`);
        }
        return avatar;
    }
    async setAvatarLevel(level, imageUrl, description) {
        const existingAvatar = await this.avatarLevelModel.findOne({ level });
        if (existingAvatar) {
            existingAvatar.imageUrl = imageUrl;
            if (description !== undefined) {
                existingAvatar.description = description;
            }
            await existingAvatar.save();
            await this.loadAvatarsToCache();
            return existingAvatar;
        }
        else {
            const newAvatar = await this.avatarLevelModel.create({
                level,
                imageUrl,
                description,
            });
            await this.loadAvatarsToCache();
            return newAvatar;
        }
    }
    async deleteAvatarLevel(level) {
        const avatar = await this.avatarLevelModel.findOneAndDelete({ level });
        if (!avatar) {
            throw new common_1.NotFoundException(`Аватар для рівня ${level} не знайдено`);
        }
        await this.loadAvatarsToCache();
        return { message: `Аватар для рівня ${level} видалено` };
    }
    async initializeDefaultAvatars() {
        const existingCount = await this.avatarLevelModel.countDocuments();
        if (existingCount > 0) {
            return { message: 'Аватари вже ініціалізовані', count: existingCount };
        }
        const defaultAvatars = [];
        for (let i = 0; i <= 10; i++) {
            defaultAvatars.push({
                level: i,
                imageUrl: `/avatars/level-${i}.png`,
                description: i === 0 ? 'Початковий аватар' : `Аватар після ${i} модуля`,
            });
        }
        await this.avatarLevelModel.insertMany(defaultAvatars);
        await this.loadAvatarsToCache();
        return { message: 'Дефолтні аватари створено', count: 11 };
    }
    async getLessonRatingsStatistics(moduleId) {
        const users = await this.userModel.find().select('completedLessons firstName lastName email').exec();
        const ratings = [];
        for (const user of users) {
            if (!user.completedLessons || user.completedLessons.length === 0)
                continue;
            for (const lesson of user.completedLessons) {
                if (moduleId && lesson.moduleId !== moduleId)
                    continue;
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
    async sendCustomNotification(title, message, url, sendToAll, userIds) {
        const payload = {
            title,
            body: message,
            icon: '/icons/icon-192.png',
            badge: '/icons/icon-192.png',
            data: url ? { url } : undefined,
        };
        if (sendToAll) {
            const result = await this.notificationsService.sendNotificationToAll(payload);
            return { sent: result.sent, failed: result.failed };
        }
        else if (userIds && userIds.length > 0) {
            console.log('Sending notifications to users:', userIds);
            let totalSent = 0;
            let totalFailed = 0;
            for (const userId of userIds) {
                try {
                    console.log(`Sending notification to user ${userId}`);
                    const result = await this.notificationsService.sendNotificationToUser(userId, payload);
                    console.log(`Result for user ${userId}:`, result);
                    totalSent += result.sent;
                    totalFailed += result.failed;
                }
                catch (error) {
                    console.error(`Failed to send notification to user ${userId}:`, error);
                    totalFailed++;
                }
            }
            console.log(`Total sent: ${totalSent}, Total failed: ${totalFailed}`);
            return { sent: totalSent, failed: totalFailed };
        }
        else {
            throw new Error('Потрібно вказати або sendToAll=true, або список userIds');
        }
    }
    async exportUsersToCSV(filters) {
        const query = {};
        if (filters?.tariff) {
            query.tariff = filters.tariff;
        }
        if (filters?.faculty) {
            query.faculty = filters.faculty;
        }
        if (filters?.curatorId) {
            query.curatorId = filters.curatorId;
        }
        if (filters?.role) {
            if (filters.role === 'admin') {
                query.isAdmin = true;
            }
            else if (filters.role === 'curator') {
                query.isCurator = true;
            }
            else if (filters.role === 'student') {
                query.isAdmin = false;
                query.isCurator = false;
            }
        }
        const users = await this.userModel.find(query).select('-password').sort({ createdAt: -1 });
        const curatorIds = [...new Set(users.filter(u => u.curatorId).map(u => u.curatorId))];
        const curators = await this.userModel.find({ _id: { $in: curatorIds } }).select('firstName lastName');
        const curatorMap = new Map(curators.map(c => [c._id.toString(), `${c.firstName} ${c.lastName}`]));
        const csvRows = [];
        csvRows.push([
            'Email',
            'Ім\'я',
            'Прізвище',
            'Телефон/Telegram',
            'Група',
            'Тариф',
            'Факультет',
            'Доступ до',
            'Куратор',
            'Адмін',
            'Куратор (роль)',
            'Пройдено уроків',
            'Пройдено модулів',
            'Заробіток',
            'Дата реєстрації'
        ].join(','));
        for (const user of users) {
            const curatorName = user.curatorId ? curatorMap.get(user.curatorId) || 'Не знайдено' : '-';
            const accessUntil = user.accessUntil ? new Date(user.accessUntil).toLocaleDateString('uk-UA') : 'Безлімітний';
            const createdAt = user.createdAt ? new Date(user.createdAt).toLocaleDateString('uk-UA') : '-';
            csvRows.push([
                user.email,
                user.firstName,
                user.lastName,
                user.phoneOrTelegram || '-',
                user.group || '-',
                user.tariff || '-',
                user.faculty || '-',
                accessUntil,
                curatorName,
                user.isAdmin ? 'Так' : 'Ні',
                user.isCurator ? 'Так' : 'Ні',
                user.completedLessons?.length || 0,
                user.completedModules?.length || 0,
                user.earnings || 0,
                createdAt
            ].map(field => `"${field}"`).join(','));
        }
        return {
            csv: csvRows.join('\n'),
            filename: `users_export_${new Date().toISOString().split('T')[0]}.csv`,
            totalUsers: users.length
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(module_schema_1.Module.name)),
    __param(2, (0, mongoose_1.InjectModel)(avatar_level_schema_1.AvatarLevel.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        notifications_service_1.NotificationsService])
], AdminService);
//# sourceMappingURL=admin.service.js.map