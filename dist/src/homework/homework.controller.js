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
exports.HomeworkController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const homework_service_1 = require("./homework.service");
const multer_config_1 = require("../config/multer.config");
let HomeworkController = class HomeworkController {
    homeworkService;
    constructor(homeworkService) {
        this.homeworkService = homeworkService;
    }
    async submitHomework(req, files) {
        const userId = req.user._id.toString();
        const dto = {
            moduleId: req.body.moduleId,
            lessonNumber: req.body.lessonNumber,
            answer: req.body.answer,
            attachments: req.body.attachments,
        };
        return this.homeworkService.submitHomework(userId, dto, files);
    }
    async getMyHomework(req, moduleId, lessonNumber) {
        const userId = req.user._id.toString();
        return this.homeworkService.getMyHomework(userId, moduleId, lessonNumber);
    }
    async getMyAllHomeworks(req) {
        const userId = req.user._id.toString();
        return this.homeworkService.getMyAllHomeworks(userId);
    }
};
exports.HomeworkController = HomeworkController;
__decorate([
    (0, common_1.Post)('submit'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 5, multer_config_1.homeworkFilesConfig)),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], HomeworkController.prototype, "submitHomework", null);
__decorate([
    (0, common_1.Get)('my/:moduleId/:lessonNumber'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('moduleId')),
    __param(2, (0, common_1.Param)('lessonNumber', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number]),
    __metadata("design:returntype", Promise)
], HomeworkController.prototype, "getMyHomework", null);
__decorate([
    (0, common_1.Get)('my'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HomeworkController.prototype, "getMyAllHomeworks", null);
exports.HomeworkController = HomeworkController = __decorate([
    (0, common_1.Controller)('homework'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [homework_service_1.HomeworkService])
], HomeworkController);
//# sourceMappingURL=homework.controller.js.map