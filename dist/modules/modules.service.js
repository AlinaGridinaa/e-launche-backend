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
exports.ModulesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const module_schema_1 = require("../schemas/module.schema");
let ModulesService = class ModulesService {
    moduleModel;
    constructor(moduleModel) {
        this.moduleModel = moduleModel;
    }
    async findAll() {
        return this.moduleModel.find().exec();
    }
    async findById(id) {
        return this.moduleModel.findById(id).exec();
    }
    async findByNumber(number) {
        return this.moduleModel.findOne({ number }).exec();
    }
    async create(moduleData) {
        const newModule = new this.moduleModel(moduleData);
        return newModule.save();
    }
    async update(id, moduleData) {
        return this.moduleModel
            .findByIdAndUpdate(id, moduleData, { new: true })
            .exec();
    }
    async delete(id) {
        return this.moduleModel.findByIdAndDelete(id).exec();
    }
    async updateLessonCompletion(moduleId, lessonNumber, isCompleted) {
        const module = await this.moduleModel.findById(moduleId).exec();
        if (!module) {
            throw new Error('Module not found');
        }
        const lesson = module.lessons.find((l) => l.number === lessonNumber);
        if (!lesson) {
            throw new Error('Lesson not found');
        }
        lesson.isCompleted = isCompleted;
        const completedCount = module.lessons.filter((l) => l.isCompleted).length;
        module.progress = Math.round((completedCount / module.lessons.length) * 100);
        return module.save();
    }
    async deleteAll() {
        await this.moduleModel.deleteMany({}).exec();
    }
    async createMany(modules) {
        return this.moduleModel.insertMany(modules);
    }
};
exports.ModulesService = ModulesService;
exports.ModulesService = ModulesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(module_schema_1.Module.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ModulesService);
//# sourceMappingURL=modules.service.js.map