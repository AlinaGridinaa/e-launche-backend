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
exports.CuratorService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const homework_schema_1 = require("../schemas/homework.schema");
const user_schema_1 = require("../schemas/user.schema");
const module_schema_1 = require("../schemas/module.schema");
let CuratorService = class CuratorService {
    homeworkModel;
    userModel;
    moduleModel;
    constructor(homeworkModel, userModel, moduleModel) {
        this.homeworkModel = homeworkModel;
        this.userModel = userModel;
        this.moduleModel = moduleModel;
    }
    async getHomeworksForCurator(curatorId) {
        const students = await this.userModel.find({ curatorId }).select('_id firstName lastName');
        const studentIds = students.map(s => s._id.toString());
        const homeworks = await this.homeworkModel
            .find({ userId: { $in: studentIds } })
            .sort({ submittedAt: -1 });
        const enrichedHomeworks = await Promise.all(homeworks.map(async (homework) => {
            const student = students.find(s => s._id.toString() === homework.userId);
            const module = await this.moduleModel.findById(homework.moduleId).select('title number');
            return {
                id: homework._id,
                studentId: homework.userId,
                studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown',
                moduleId: homework.moduleId,
                moduleTitle: module?.title || 'Unknown Module',
                moduleNumber: module?.number,
                lessonNumber: homework.lessonNumber,
                answer: homework.answer,
                attachments: homework.attachments,
                status: homework.status,
                score: homework.score,
                feedback: homework.feedback,
                submittedAt: homework.submittedAt,
                reviewedAt: homework.reviewedAt,
            };
        }));
        return enrichedHomeworks;
    }
    async reviewHomework(curatorId, homeworkId, score, feedback) {
        const homework = await this.homeworkModel.findById(homeworkId);
        if (!homework) {
            throw new common_1.NotFoundException('Домашнє завдання не знайдено');
        }
        const student = await this.userModel.findById(homework.userId);
        if (!student || student.curatorId !== curatorId) {
            throw new common_1.ForbiddenException('Це не ваш студент');
        }
        homework.curatorId = curatorId;
        homework.score = score;
        homework.feedback = feedback;
        homework.status = 'reviewed';
        homework.reviewedAt = new Date();
        await homework.save();
        return {
            id: homework._id,
            score: homework.score,
            feedback: homework.feedback,
            status: homework.status,
            reviewedAt: homework.reviewedAt,
        };
    }
    async returnForRevision(curatorId, homeworkId, feedback) {
        const homework = await this.homeworkModel.findById(homeworkId);
        if (!homework) {
            throw new common_1.NotFoundException('Домашнє завдання не знайдено');
        }
        const student = await this.userModel.findById(homework.userId);
        if (!student || student.curatorId !== curatorId) {
            throw new common_1.ForbiddenException('Це не ваш студент');
        }
        homework.curatorId = curatorId;
        homework.feedback = feedback;
        homework.status = 'needs_revision';
        homework.reviewedAt = new Date();
        homework.score = undefined;
        await homework.save();
        return {
            id: homework._id,
            feedback: homework.feedback,
            status: homework.status,
            reviewedAt: homework.reviewedAt,
        };
    }
    async getMyStudents(curatorId) {
        const students = await this.userModel
            .find({ curatorId })
            .select('firstName lastName email faculty completedLessons completedModules earnings');
        return students.map(student => ({
            id: student._id,
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            faculty: student.faculty,
            completedLessonsCount: student.completedLessons?.length || 0,
            completedModulesCount: student.completedModules?.length || 0,
            earnings: student.earnings,
        }));
    }
    async getAllModules() {
        const modules = await this.moduleModel
            .find()
            .select('number title description coverImage lessons')
            .sort({ number: 1 });
        return modules.map(module => ({
            id: module._id,
            number: module.number,
            title: module.title,
            description: module.description,
            lessonsCount: module.lessons?.length || 0,
        }));
    }
};
exports.CuratorService = CuratorService;
exports.CuratorService = CuratorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(homework_schema_1.Homework.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(module_schema_1.Module.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], CuratorService);
//# sourceMappingURL=curator.service.js.map