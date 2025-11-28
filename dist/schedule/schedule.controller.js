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
exports.ScheduleController = void 0;
const common_1 = require("@nestjs/common");
const schedule_service_1 = require("./schedule.service");
const create_schedule_event_dto_1 = require("./dto/create-schedule-event.dto");
const update_schedule_event_dto_1 = require("./dto/update-schedule-event.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let ScheduleController = class ScheduleController {
    scheduleService;
    constructor(scheduleService) {
        this.scheduleService = scheduleService;
    }
    async findAll() {
        const events = await this.scheduleService.findAll();
        return {
            success: true,
            data: events,
        };
    }
    async findUpcoming() {
        const events = await this.scheduleService.findUpcoming();
        return {
            success: true,
            data: events,
        };
    }
    async findByDateRange(startDate, endDate) {
        const events = await this.scheduleService.findByDateRange(new Date(startDate), new Date(endDate));
        return {
            success: true,
            data: events,
        };
    }
    async findOne(id) {
        const event = await this.scheduleService.findOne(id);
        return {
            success: true,
            data: event,
        };
    }
    async create(createDto) {
        const event = await this.scheduleService.create(createDto);
        return {
            success: true,
            data: event,
            message: 'Подію створено успішно',
        };
    }
    async update(id, updateDto) {
        const event = await this.scheduleService.update(id, updateDto);
        return {
            success: true,
            data: event,
            message: 'Подію оновлено успішно',
        };
    }
    async markAsCompleted(id) {
        const event = await this.scheduleService.markAsCompleted(id);
        return {
            success: true,
            data: event,
            message: 'Подію відмічено як завершену',
        };
    }
    async remove(id) {
        await this.scheduleService.remove(id);
    }
};
exports.ScheduleController = ScheduleController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('upcoming'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "findUpcoming", null);
__decorate([
    (0, common_1.Get)('range'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "findByDateRange", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_schedule_event_dto_1.CreateScheduleEventDto]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_schedule_event_dto_1.UpdateScheduleEventDto]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/complete'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "markAsCompleted", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "remove", null);
exports.ScheduleController = ScheduleController = __decorate([
    (0, common_1.Controller)('schedule'),
    __metadata("design:paramtypes", [schedule_service_1.ScheduleService])
], ScheduleController);
//# sourceMappingURL=schedule.controller.js.map