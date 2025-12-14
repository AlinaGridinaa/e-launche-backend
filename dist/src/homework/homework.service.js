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
exports.HomeworkService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const homework_schema_1 = require("../schemas/homework.schema");
const user_schema_1 = require("../schemas/user.schema");
const module_schema_1 = require("../schemas/module.schema");
const cloudinary_config_1 = require("../config/cloudinary.config");
let HomeworkService = class HomeworkService {
    homeworkModel;
    userModel;
    moduleModel;
    constructor(homeworkModel, userModel, moduleModel) {
        this.homeworkModel = homeworkModel;
        this.userModel = userModel;
        this.moduleModel = moduleModel;
    }
    async submitHomework(userId, dto, files) {
        let attachments = [];
        if (dto.attachments) {
            try {
                attachments = typeof dto.attachments === 'string'
                    ? JSON.parse(dto.attachments)
                    : dto.attachments;
            }
            catch (error) {
                console.error('Failed to parse attachments:', error);
                attachments = [];
            }
        }
        const lessonNumber = parseInt(dto.lessonNumber, 10);
        if (isNaN(lessonNumber)) {
            throw new common_1.BadRequestException('lessonNumber повинен бути числом');
        }
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Користувача не знайдено');
        }
        const module = await this.moduleModel.findById(dto.moduleId);
        if (!module) {
            throw new common_1.NotFoundException('Модуль не знайдено');
        }
        let fileAttachments = [];
        if (files && files.length > 0) {
            try {
                fileAttachments = await Promise.all(files.map(file => (0, cloudinary_config_1.uploadBufferToCloudinary)(file.buffer, 'homework-files', 'raw')));
                console.log('Files uploaded successfully:', fileAttachments);
            }
            catch (error) {
                console.error('Failed to upload files:', error);
                throw new common_1.BadRequestException(`Помилка завантаження файлів: ${error.message}`);
            }
        }
        const existingHomework = await this.homeworkModel.findOne({
            userId,
            moduleId: dto.moduleId,
            lessonNumber: lessonNumber,
        });
        if (existingHomework) {
            existingHomework.answer = dto.answer;
            existingHomework.attachments = attachments;
            existingHomework.fileAttachments = fileAttachments;
            existingHomework.status = 'pending';
            existingHomework.submittedAt = new Date();
            existingHomework.curatorId = user.curatorId;
            existingHomework.score = undefined;
            existingHomework.feedback = undefined;
            existingHomework.reviewedAt = undefined;
            await existingHomework.save();
            return existingHomework;
        }
        const homework = new this.homeworkModel({
            userId,
            moduleId: dto.moduleId,
            lessonNumber: lessonNumber,
            answer: dto.answer,
            attachments: attachments,
            fileAttachments: fileAttachments,
            status: 'pending',
            curatorId: user.curatorId,
            submittedAt: new Date(),
        });
        await homework.save();
        return homework;
    }
    async getMyHomework(userId, moduleId, lessonNumber) {
        const homework = await this.homeworkModel.findOne({
            userId,
            moduleId,
            lessonNumber,
        });
        return homework;
    }
    async getMyAllHomeworks(userId) {
        const homeworks = await this.homeworkModel.find({ userId }).sort({ submittedAt: -1 });
        const homeworksWithDetails = await Promise.all(homeworks.map(async (hw) => {
            const module = await this.moduleModel.findById(hw.moduleId);
            return {
                id: hw._id,
                moduleId: hw.moduleId,
                moduleTitle: module?.title || 'Невідомий модуль',
                moduleNumber: module?.number || 0,
                lessonNumber: hw.lessonNumber,
                answer: hw.answer,
                attachments: hw.attachments,
                status: hw.status,
                score: hw.score,
                feedback: hw.feedback,
                submittedAt: hw.submittedAt,
                reviewedAt: hw.reviewedAt,
            };
        }));
        return homeworksWithDetails;
    }
};
exports.HomeworkService = HomeworkService;
exports.HomeworkService = HomeworkService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(homework_schema_1.Homework.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(module_schema_1.Module.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], HomeworkService);
//# sourceMappingURL=homework.service.js.map