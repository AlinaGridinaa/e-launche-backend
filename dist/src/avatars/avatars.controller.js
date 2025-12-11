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
exports.AvatarsController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const avatar_level_schema_1 = require("../schemas/avatar-level.schema");
let AvatarsController = class AvatarsController {
    avatarLevelModel;
    constructor(avatarLevelModel) {
        this.avatarLevelModel = avatarLevelModel;
    }
    async getAllAvatars() {
        return this.avatarLevelModel.find().sort({ level: 1 }).exec();
    }
    async getAvatarByLevel(level) {
        return this.avatarLevelModel.findOne({ level: +level }).exec();
    }
};
exports.AvatarsController = AvatarsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AvatarsController.prototype, "getAllAvatars", null);
__decorate([
    (0, common_1.Get)(':level'),
    __param(0, (0, common_1.Param)('level')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AvatarsController.prototype, "getAvatarByLevel", null);
exports.AvatarsController = AvatarsController = __decorate([
    (0, common_1.Controller)('avatars'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, mongoose_1.InjectModel)(avatar_level_schema_1.AvatarLevel.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AvatarsController);
//# sourceMappingURL=avatars.controller.js.map