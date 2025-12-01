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
exports.AchievementsController = void 0;
const common_1 = require("@nestjs/common");
const achievements_service_1 = require("./achievements.service");
const submit_achievement_dto_1 = require("./dto/submit-achievement.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let AchievementsController = class AchievementsController {
    achievementsService;
    constructor(achievementsService) {
        this.achievementsService = achievementsService;
    }
    async getAllTypes() {
        const types = this.achievementsService.getAllAchievementTypes();
        return {
            success: true,
            data: types,
        };
    }
    async getMyAchievements(req) {
        const userId = req.user.sub;
        const achievements = await this.achievementsService.getUserAchievements(userId);
        return {
            success: true,
            data: achievements,
        };
    }
    async submitAchievement(req, dto) {
        const userId = req.user.sub;
        const achievement = await this.achievementsService.submitAchievement(userId, dto);
        return {
            success: true,
            data: achievement,
            message: 'Заявку відправлено на розгляд',
        };
    }
    async getPendingAchievements(req) {
        if (!req.user.isCurator && !req.user.isAdmin) {
            return {
                success: false,
                message: 'Доступ заборонено',
            };
        }
        const achievements = await this.achievementsService.getAllPendingAchievements();
        return {
            success: true,
            data: achievements,
        };
    }
    async approveAchievement(req, id, body) {
        if (!req.user.isCurator && !req.user.isAdmin) {
            return {
                success: false,
                message: 'Доступ заборонено',
            };
        }
        const achievement = await this.achievementsService.approveAchievement(id, body.comment);
        return {
            success: true,
            data: achievement,
            message: 'Нагороду схвалено',
        };
    }
    async rejectAchievement(req, id, body) {
        if (!req.user.isCurator && !req.user.isAdmin) {
            return {
                success: false,
                message: 'Доступ заборонено',
            };
        }
        const achievement = await this.achievementsService.rejectAchievement(id, body.comment);
        return {
            success: true,
            data: achievement,
            message: 'Заявку відхилено',
        };
    }
};
exports.AchievementsController = AchievementsController;
__decorate([
    (0, common_1.Get)('types'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AchievementsController.prototype, "getAllTypes", null);
__decorate([
    (0, common_1.Get)('my'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AchievementsController.prototype, "getMyAchievements", null);
__decorate([
    (0, common_1.Post)('submit'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, submit_achievement_dto_1.SubmitAchievementDto]),
    __metadata("design:returntype", Promise)
], AchievementsController.prototype, "submitAchievement", null);
__decorate([
    (0, common_1.Get)('pending'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AchievementsController.prototype, "getPendingAchievements", null);
__decorate([
    (0, common_1.Put)(':id/approve'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AchievementsController.prototype, "approveAchievement", null);
__decorate([
    (0, common_1.Put)(':id/reject'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AchievementsController.prototype, "rejectAchievement", null);
exports.AchievementsController = AchievementsController = __decorate([
    (0, common_1.Controller)('achievements'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [achievements_service_1.AchievementsService])
], AchievementsController);
//# sourceMappingURL=achievements.controller.js.map