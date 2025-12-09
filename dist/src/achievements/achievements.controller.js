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
exports.AchievementsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const achievements_service_1 = require("./achievements.service");
const submit_achievement_dto_1 = require("./dto/submit-achievement.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const cloudinary_1 = require("cloudinary");
const fs = __importStar(require("fs"));
let AchievementsController = class AchievementsController {
    achievementsService;
    constructor(achievementsService) {
        this.achievementsService = achievementsService;
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
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
    async uploadProof(req, file) {
        if (!file) {
            throw new common_1.BadRequestException('Файл не завантажено');
        }
        try {
            const result = await cloudinary_1.v2.uploader.upload(file.path, {
                folder: 'hogwarts/achievements',
                resource_type: 'auto',
            });
            fs.unlinkSync(file.path);
            return {
                success: true,
                fileUrl: result.secure_url,
                message: 'Файл успішно завантажено',
            };
        }
        catch (error) {
            console.error('Upload error:', error);
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
            throw new common_1.BadRequestException('Помилка завантаження файлу на Cloudinary');
        }
    }
    async submitAchievement(req, dto) {
        const userId = req.user._id || req.user.sub;
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
    (0, common_1.Post)('upload-proof'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/achievements',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                callback(null, `proof-${uniqueSuffix}${ext}`);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|pdf)$/)) {
                return callback(new common_1.BadRequestException('Тільки зображення та PDF дозволені!'), false);
            }
            callback(null, true);
        },
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AchievementsController.prototype, "uploadProof", null);
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