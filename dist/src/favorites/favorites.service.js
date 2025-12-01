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
exports.FavoritesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../schemas/user.schema");
const module_schema_1 = require("../schemas/module.schema");
let FavoritesService = class FavoritesService {
    userModel;
    moduleModel;
    constructor(userModel, moduleModel) {
        this.userModel = userModel;
        this.moduleModel = moduleModel;
    }
    async addToFavorites(userId, moduleId, lessonNumber) {
        console.log('addToFavorites called with:', { userId, moduleId, lessonNumber });
        console.log('userId type:', typeof userId);
        const user = await this.userModel.findById(userId).exec();
        console.log('User found:', user ? user.email : 'null');
        console.log('User ID from DB:', user ? user._id : 'null');
        if (!user) {
            const allUsers = await this.userModel.find().limit(5).exec();
            console.log('First 5 users in DB:', allUsers.map(u => ({ id: u._id, email: u.email })));
            throw new common_1.NotFoundException('Користувача не знайдено');
        }
        const module = await this.moduleModel.findById(moduleId);
        if (!module) {
            throw new common_1.NotFoundException('Модуль не знайдено');
        }
        const lesson = module.lessons.find(l => l.number === lessonNumber);
        if (!lesson) {
            throw new common_1.NotFoundException('Урок не знайдено');
        }
        const existingIndex = user.favoriteLessons.findIndex(fav => fav.moduleId === moduleId && fav.lessonNumber === lessonNumber);
        if (existingIndex === -1) {
            user.favoriteLessons.push({
                moduleId,
                lessonNumber,
                addedAt: new Date(),
            });
            await user.save();
        }
        return {
            success: true,
            lesson: {
                moduleId,
                lessonNumber,
                isFavorite: true,
            },
        };
    }
    async removeFromFavorites(userId, moduleId, lessonNumber) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Користувача не знайдено');
        }
        user.favoriteLessons = user.favoriteLessons.filter(fav => !(fav.moduleId === moduleId && fav.lessonNumber === lessonNumber));
        await user.save();
        return {
            success: true,
            lesson: {
                moduleId,
                lessonNumber,
                isFavorite: false,
            },
        };
    }
    async getFavorites(userId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Користувача не знайдено');
        }
        const favorites = [];
        for (const fav of user.favoriteLessons) {
            const module = await this.moduleModel.findById(fav.moduleId);
            if (module) {
                const lesson = module.lessons.find(l => l.number === fav.lessonNumber);
                if (lesson) {
                    favorites.push({
                        moduleId: module._id,
                        moduleNumber: module.number,
                        moduleTitle: module.title,
                        lessonNumber: lesson.number,
                        lessonTitle: lesson.title,
                        videoUrl: lesson.videoUrl,
                        description: lesson.description,
                        duration: lesson.duration,
                        isCompleted: lesson.isCompleted,
                        addedAt: fav.addedAt,
                    });
                }
            }
        }
        favorites.sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime());
        return {
            favorites,
            total: favorites.length,
        };
    }
    async isFavorite(userId, moduleId, lessonNumber) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            return false;
        }
        return user.favoriteLessons.some(fav => fav.moduleId === moduleId && fav.lessonNumber === lessonNumber);
    }
};
exports.FavoritesService = FavoritesService;
exports.FavoritesService = FavoritesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(module_schema_1.Module.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], FavoritesService);
//# sourceMappingURL=favorites.service.js.map