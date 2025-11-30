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
exports.CuratorController = void 0;
const common_1 = require("@nestjs/common");
const curator_service_1 = require("./curator.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let CuratorController = class CuratorController {
    curatorService;
    constructor(curatorService) {
        this.curatorService = curatorService;
    }
    async getHomeworks(req) {
        const curatorId = req.user._id.toString();
        return this.curatorService.getHomeworksForCurator(curatorId);
    }
    async reviewHomework(req, homeworkId, reviewDto) {
        const curatorId = req.user._id.toString();
        return this.curatorService.reviewHomework(curatorId, homeworkId, reviewDto.score, reviewDto.feedback);
    }
    async returnForRevision(req, homeworkId, returnDto) {
        const curatorId = req.user._id.toString();
        return this.curatorService.returnForRevision(curatorId, homeworkId, returnDto.feedback);
    }
    async getMyStudents(req) {
        const curatorId = req.user._id.toString();
        return this.curatorService.getMyStudents(curatorId);
    }
    async getAllModules() {
        return this.curatorService.getAllModules();
    }
};
exports.CuratorController = CuratorController;
__decorate([
    (0, common_1.Get)('homeworks'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CuratorController.prototype, "getHomeworks", null);
__decorate([
    (0, common_1.Put)('homeworks/:homeworkId/review'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('homeworkId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CuratorController.prototype, "reviewHomework", null);
__decorate([
    (0, common_1.Put)('homeworks/:homeworkId/return'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('homeworkId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CuratorController.prototype, "returnForRevision", null);
__decorate([
    (0, common_1.Get)('students'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CuratorController.prototype, "getMyStudents", null);
__decorate([
    (0, common_1.Get)('modules'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CuratorController.prototype, "getAllModules", null);
exports.CuratorController = CuratorController = __decorate([
    (0, common_1.Controller)('curator'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [curator_service_1.CuratorService])
], CuratorController);
//# sourceMappingURL=curator.controller.js.map