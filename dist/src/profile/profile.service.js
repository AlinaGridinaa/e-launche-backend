"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../schemas/user.schema");
const module_schema_1 = require("../schemas/module.schema");
const avatars_config_1 = require("../config/avatars.config");
let ProfileService = class ProfileService {
    userModel;
    moduleModel;
    constructor(userModel, moduleModel) {
        this.userModel = userModel;
        this.moduleModel = moduleModel;
    }
    async getProfile(userId) {
        const user = await this.userModel
            .findById(userId)
            .select('-password')
            .exec();
        if (!user) {
            throw new common_1.NotFoundException('Користувача не знайдено');
        }
        const modules = await this.moduleModel.find().exec();
        const totalModules = modules.length;
        const totalLessons = modules.reduce((sum, module) => sum + module.lessons.length, 0);
        const modulesCompleted = user.completedModules?.length || 0;
        const completedLessons = user.completedLessons?.length || 0;
        const earnings = user.earnings || 0;
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
        const avatarUrl = (0, avatars_config_1.getAvatarForLevel)(modulesCompleted);
        const userObject = user.toObject();
        userObject.avatarUrl = avatarUrl;
        return {
            user: userObject,
            stats,
        };
    }
    async updateProfile(userId, updateProfileDto) {
        const user = await this.userModel
            .findByIdAndUpdate(userId, updateProfileDto, { new: true })
            .select('-password')
            .exec();
        if (!user) {
            throw new common_1.NotFoundException('Користувача не знайдено');
        }
        return user;
    }
    async updateAvatar(userId, avatarUrl) {
        const user = await this.userModel
            .findByIdAndUpdate(userId, { avatarUrl }, { new: true })
            .select('-password')
            .exec();
        if (!user) {
            throw new common_1.NotFoundException('Користувача не знайдено');
        }
        return {
            success: true,
            avatarUrl: user.avatarUrl,
            user: user.toObject(),
        };
    }
    async getEarnings(userId) {
        const user = await this.userModel.findById(userId).select('earningsHistory earnings').exec();
        if (!user) {
            throw new common_1.NotFoundException('Користувача не знайдено');
        }
        return {
            totalEarnings: user.earnings || 0,
            history: user.earningsHistory || [],
        };
    }
    async addEarning(userId, earningData) {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new common_1.NotFoundException('Користувача не знайдено');
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
        user.earnings = (user.earnings || 0) + earningData.amount;
        await user.save();
        return {
            success: true,
            message: 'Дохід додано успішно',
            totalEarnings: user.earnings,
            history: user.earningsHistory,
        };
    }
    async deleteEarning(userId, earningId) {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new common_1.NotFoundException('Користувача не знайдено');
        }
        const earning = user.earningsHistory?.find(e => e._id?.toString() === earningId);
        if (!earning) {
            throw new common_1.NotFoundException('Запис про дохід не знайдено');
        }
        user.earnings = (user.earnings || 0) - earning.amount;
        user.earningsHistory = user.earningsHistory?.filter(e => e._id?.toString() !== earningId) || [];
        await user.save();
        return {
            success: true,
            message: 'Дохід видалено успішно',
            totalEarnings: user.earnings,
            history: user.earningsHistory,
        };
    }
    async getLeaderboard(currentUserId) {
        const topUsers = await this.userModel
            .find({ earnings: { $gt: 0 } })
            .select('firstName lastName earnings')
            .sort({ earnings: -1 })
            .limit(10)
            .exec();
        const currentUser = await this.userModel
            .findById(currentUserId)
            .select('firstName lastName earnings')
            .exec();
        if (!currentUser) {
            throw new common_1.NotFoundException('Користувача не знайдено');
        }
        const allUsersCount = await this.userModel.countDocuments({ earnings: { $gte: currentUser.earnings } }).exec();
        const currentUserRank = allUsersCount;
        const leaderboard = topUsers.map((user, index) => ({
            rank: index + 1,
            name: `${user.firstName} ${user.lastName}`,
            earnings: user.earnings,
            isCurrentUser: user._id.toString() === currentUserId,
        }));
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
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(module_schema_1.Module.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ProfileService);
//# sourceMappingURL=profile.service.js.map