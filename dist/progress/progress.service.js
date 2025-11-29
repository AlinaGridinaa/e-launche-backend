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
exports.ProgressService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../schemas/user.schema");
let ProgressService = class ProgressService {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async completeLesson(userId, moduleId, lessonNumber) {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new common_1.NotFoundException('Користувача не знайдено');
        }
        const alreadyCompleted = user.completedLessons?.some((lesson) => lesson.moduleId === moduleId && lesson.lessonNumber === lessonNumber);
        if (!alreadyCompleted) {
            if (!user.completedLessons) {
                user.completedLessons = [];
            }
            user.completedLessons.push({
                moduleId,
                lessonNumber,
                completedAt: new Date(),
            });
            await user.save();
        }
        return {
            success: true,
            message: 'Урок позначено як завершений',
            completedLessons: user.completedLessons.length,
        };
    }
    async uncompleteLesson(userId, moduleId, lessonNumber) {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new common_1.NotFoundException('Користувача не знайдено');
        }
        if (user.completedLessons) {
            user.completedLessons = user.completedLessons.filter((lesson) => !(lesson.moduleId === moduleId && lesson.lessonNumber === lessonNumber));
            await user.save();
        }
        return {
            success: true,
            message: 'Урок позначено як незавершений',
            completedLessons: user.completedLessons?.length || 0,
        };
    }
    async completeModule(userId, moduleId) {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new common_1.NotFoundException('Користувача не знайдено');
        }
        if (!user.completedModules) {
            user.completedModules = [];
        }
        if (!user.completedModules.includes(moduleId)) {
            user.completedModules.push(moduleId);
            await user.save();
        }
        return {
            success: true,
            message: 'Модуль позначено як завершений',
            completedModules: user.completedModules.length,
        };
    }
    async isLessonCompleted(userId, moduleId, lessonNumber) {
        const user = await this.userModel.findById(userId).exec();
        if (!user || !user.completedLessons) {
            return false;
        }
        return user.completedLessons.some((lesson) => lesson.moduleId === moduleId && lesson.lessonNumber === lessonNumber);
    }
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProgressService);
//# sourceMappingURL=progress.service.js.map