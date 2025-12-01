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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const admin_service_1 = require("./admin.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const assign_faculty_dto_1 = require("./dto/assign-faculty.dto");
const create_user_dto_1 = require("./dto/create-user.dto");
const award_achievement_dto_1 = require("./dto/award-achievement.dto");
const multer_config_1 = require("../config/multer.config");
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getAllUsers() {
        return this.adminService.getAllUsers();
    }
    async createUser(createUserDto) {
        return this.adminService.createUser(createUserDto);
    }
    async assignFaculty(userId, assignFacultyDto) {
        return this.adminService.assignFaculty(userId, assignFacultyDto.faculty);
    }
    async toggleAdmin(userId) {
        return this.adminService.toggleAdmin(userId);
    }
    async getStats() {
        return this.adminService.getStats();
    }
    async awardAchievement(userId, achievementDto) {
        return this.adminService.awardAchievement(userId, achievementDto);
    }
    async getUserAchievements(userId) {
        return this.adminService.getUserAchievements(userId);
    }
    async removeAchievement(userId, achievementId) {
        return this.adminService.removeAchievement(userId, achievementId);
    }
    async toggleCurator(userId) {
        return this.adminService.toggleCurator(userId);
    }
    async assignCurator(userId, body) {
        return this.adminService.assignCurator(userId, body.curatorId);
    }
    async getAllCurators() {
        return this.adminService.getAllCurators();
    }
    async getAllModules() {
        return this.adminService.getAllModules();
    }
    async getModuleById(moduleId) {
        return this.adminService.getModuleById(moduleId);
    }
    async createModule(moduleData) {
        return this.adminService.createModule(moduleData);
    }
    async updateModule(moduleId, updateData) {
        return this.adminService.updateModule(moduleId, updateData);
    }
    async deleteModule(moduleId) {
        return this.adminService.deleteModule(moduleId);
    }
    async toggleModuleLock(moduleId) {
        return this.adminService.toggleModuleLock(moduleId);
    }
    async createLesson(moduleId, lessonData) {
        return this.adminService.createLesson(moduleId, lessonData);
    }
    async updateLesson(moduleId, lessonNumber, updateData) {
        return this.adminService.updateLesson(moduleId, +lessonNumber, updateData);
    }
    async deleteLesson(moduleId, lessonNumber) {
        return this.adminService.deleteLesson(moduleId, +lessonNumber);
    }
    async addLessonMaterial(moduleId, lessonNumber, materialData) {
        return this.adminService.addLessonMaterial(moduleId, +lessonNumber, materialData);
    }
    async deleteLessonMaterial(moduleId, lessonNumber, materialIndex) {
        return this.adminService.deleteLessonMaterial(moduleId, +lessonNumber, +materialIndex);
    }
    async getAllAvatarLevels() {
        return this.adminService.getAllAvatarLevels();
    }
    async getAvatarLevel(level) {
        return this.adminService.getAvatarLevel(+level);
    }
    async setAvatarLevel(level, body) {
        return this.adminService.setAvatarLevel(+level, body.imageUrl, body.description);
    }
    async deleteAvatarLevel(level) {
        return this.adminService.deleteAvatarLevel(+level);
    }
    async initializeDefaultAvatars() {
        return this.adminService.initializeDefaultAvatars();
    }
    async uploadAvatarImage(level, file, description) {
        if (!file) {
            throw new Error('Файл не завантажено');
        }
        const imageUrl = `/uploads/avatars/${file.filename}`;
        return this.adminService.setAvatarLevel(+level, imageUrl, description);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Post)('users'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createUser", null);
__decorate([
    (0, common_1.Put)('users/:userId/faculty'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assign_faculty_dto_1.AssignFacultyDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "assignFaculty", null);
__decorate([
    (0, common_1.Put)('users/:userId/admin'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "toggleAdmin", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStats", null);
__decorate([
    (0, common_1.Post)('users/:userId/achievements'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, award_achievement_dto_1.AwardAchievementDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "awardAchievement", null);
__decorate([
    (0, common_1.Get)('users/:userId/achievements'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserAchievements", null);
__decorate([
    (0, common_1.Delete)('users/:userId/achievements/:achievementId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('achievementId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeAchievement", null);
__decorate([
    (0, common_1.Put)('users/:userId/curator-toggle'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "toggleCurator", null);
__decorate([
    (0, common_1.Put)('users/:userId/assign-curator'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "assignCurator", null);
__decorate([
    (0, common_1.Get)('curators'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllCurators", null);
__decorate([
    (0, common_1.Get)('modules'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllModules", null);
__decorate([
    (0, common_1.Get)('modules/:moduleId'),
    __param(0, (0, common_1.Param)('moduleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getModuleById", null);
__decorate([
    (0, common_1.Post)('modules'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createModule", null);
__decorate([
    (0, common_1.Put)('modules/:moduleId'),
    __param(0, (0, common_1.Param)('moduleId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateModule", null);
__decorate([
    (0, common_1.Delete)('modules/:moduleId'),
    __param(0, (0, common_1.Param)('moduleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteModule", null);
__decorate([
    (0, common_1.Put)('modules/:moduleId/toggle-lock'),
    __param(0, (0, common_1.Param)('moduleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "toggleModuleLock", null);
__decorate([
    (0, common_1.Post)('modules/:moduleId/lessons'),
    __param(0, (0, common_1.Param)('moduleId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createLesson", null);
__decorate([
    (0, common_1.Put)('modules/:moduleId/lessons/:lessonNumber'),
    __param(0, (0, common_1.Param)('moduleId')),
    __param(1, (0, common_1.Param)('lessonNumber')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateLesson", null);
__decorate([
    (0, common_1.Delete)('modules/:moduleId/lessons/:lessonNumber'),
    __param(0, (0, common_1.Param)('moduleId')),
    __param(1, (0, common_1.Param)('lessonNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteLesson", null);
__decorate([
    (0, common_1.Post)('modules/:moduleId/lessons/:lessonNumber/materials'),
    __param(0, (0, common_1.Param)('moduleId')),
    __param(1, (0, common_1.Param)('lessonNumber')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addLessonMaterial", null);
__decorate([
    (0, common_1.Delete)('modules/:moduleId/lessons/:lessonNumber/materials/:materialIndex'),
    __param(0, (0, common_1.Param)('moduleId')),
    __param(1, (0, common_1.Param)('lessonNumber')),
    __param(2, (0, common_1.Param)('materialIndex')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteLessonMaterial", null);
__decorate([
    (0, common_1.Get)('avatars'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllAvatarLevels", null);
__decorate([
    (0, common_1.Get)('avatars/:level'),
    __param(0, (0, common_1.Param)('level')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAvatarLevel", null);
__decorate([
    (0, common_1.Put)('avatars/:level'),
    __param(0, (0, common_1.Param)('level')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "setAvatarLevel", null);
__decorate([
    (0, common_1.Delete)('avatars/:level'),
    __param(0, (0, common_1.Param)('level')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteAvatarLevel", null);
__decorate([
    (0, common_1.Post)('avatars/initialize'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "initializeDefaultAvatars", null);
__decorate([
    (0, common_1.Post)('avatars/:level/upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: multer_config_1.avatarStorage,
        fileFilter: multer_config_1.imageFileFilter,
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Param)('level')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "uploadAvatarImage", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map