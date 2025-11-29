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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../schemas/user.schema");
let AdminService = class AdminService {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async getAllUsers() {
        const users = await this.userModel
            .find()
            .select('-password')
            .sort({ createdAt: -1 });
        return users.map(user => ({
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            faculty: user.faculty,
            isAdmin: user.isAdmin,
            earnings: user.earnings,
            completedLessonsCount: user.completedLessons?.length || 0,
            completedModulesCount: user.completedModules?.length || 0,
        }));
    }
    async assignFaculty(userId, faculty) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Користувача не знайдено');
        }
        user.faculty = faculty;
        await user.save();
        return {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            faculty: user.faculty,
        };
    }
    async toggleAdmin(userId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Користувача не знайдено');
        }
        user.isAdmin = !user.isAdmin;
        await user.save();
        return {
            id: user._id,
            email: user.email,
            isAdmin: user.isAdmin,
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AdminService);
//# sourceMappingURL=admin.service.js.map