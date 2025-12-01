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
exports.ModulesController = void 0;
const common_1 = require("@nestjs/common");
const modules_service_1 = require("./modules.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let ModulesController = class ModulesController {
    modulesService;
    constructor(modulesService) {
        this.modulesService = modulesService;
    }
    async findAll(request) {
        const userId = request.user._id.toString();
        return this.modulesService.findAllWithUserProgress(userId);
    }
    async findById(id, request) {
        const userId = request.user._id.toString();
        return this.modulesService.findByIdWithUserProgress(id, userId);
    }
    async findByNumber(number) {
        return this.modulesService.findByNumber(parseInt(number, 10));
    }
    async create(moduleData) {
        return this.modulesService.create(moduleData);
    }
    async update(id, moduleData) {
        return this.modulesService.update(id, moduleData);
    }
    async delete(id) {
        return this.modulesService.delete(id);
    }
    async markLessonComplete(id, lessonNumber, isCompleted) {
        return this.modulesService.updateLessonCompletion(id, parseInt(lessonNumber, 10), isCompleted);
    }
};
exports.ModulesController = ModulesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)('number/:number'),
    __param(0, (0, common_1.Param)('number')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "findByNumber", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "delete", null);
__decorate([
    (0, common_1.Put)(':id/lessons/:lessonNumber/complete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('lessonNumber')),
    __param(2, (0, common_1.Body)('isCompleted')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean]),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "markLessonComplete", null);
exports.ModulesController = ModulesController = __decorate([
    (0, common_1.Controller)('modules'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [modules_service_1.ModulesService])
], ModulesController);
//# sourceMappingURL=modules.controller.js.map