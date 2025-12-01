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
exports.AchievementsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const achievement_schema_1 = require("../schemas/achievement.schema");
const user_schema_1 = require("../schemas/user.schema");
let AchievementsService = class AchievementsService {
    userAchievementModel;
    userModel;
    constructor(userAchievementModel, userModel) {
        this.userAchievementModel = userAchievementModel;
        this.userModel = userModel;
    }
    getAllAchievementTypes() {
        return achievement_schema_1.ACHIEVEMENT_TYPES;
    }
    async getUserAchievements(userId) {
        const userAchievements = await this.userAchievementModel.find({ userId }).exec();
        return achievement_schema_1.ACHIEVEMENT_TYPES.map(type => {
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
    async submitAchievement(userId, dto) {
        const achievementType = achievement_schema_1.ACHIEVEMENT_TYPES.find(at => at.id === dto.achievementId);
        if (!achievementType) {
            throw new common_1.NotFoundException('Тип нагороди не знайдено');
        }
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
        if (existing) {
            existing.proofText = dto.proofText;
            existing.proofFile = dto.proofFile;
            existing.proofLink = dto.proofLink;
            existing.status = 'pending';
            existing.submittedAt = new Date();
            existing.curatorComment = undefined;
            return existing.save();
        }
        else {
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
    async approveAchievement(achievementId, curatorComment) {
        const achievement = await this.userAchievementModel.findById(achievementId).exec();
        if (!achievement) {
            throw new common_1.NotFoundException('Заявку не знайдено');
        }
        achievement.status = 'approved';
        achievement.approvedAt = new Date();
        if (curatorComment) {
            achievement.curatorComment = curatorComment;
        }
        return achievement.save();
    }
    async rejectAchievement(achievementId, curatorComment) {
        const achievement = await this.userAchievementModel.findById(achievementId).exec();
        if (!achievement) {
            throw new common_1.NotFoundException('Заявку не знайдено');
        }
        achievement.status = 'rejected';
        achievement.curatorComment = curatorComment;
        return achievement.save();
    }
    async getAllPendingAchievements() {
        const achievements = await this.userAchievementModel
            .find({ status: 'pending' })
            .populate('userId', 'firstName lastName email')
            .sort({ submittedAt: -1 })
            .exec();
        return achievements.map(achievement => {
            const type = achievement_schema_1.ACHIEVEMENT_TYPES.find(at => at.id === achievement.achievementId);
            return {
                ...achievement.toObject(),
                achievementType: type,
            };
        });
    }
};
exports.AchievementsService = AchievementsService;
exports.AchievementsService = AchievementsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(achievement_schema_1.UserAchievement.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], AchievementsService);
//# sourceMappingURL=achievements.service.js.map