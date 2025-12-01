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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = exports.User = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let User = class User {
    email;
    password;
    firstName;
    lastName;
    phone;
    avatarUrl;
    currentAvatarLevel;
    faculty;
    hasCompletedSorting;
    hasAcceptedRules;
    hasSeenWelcomeModal;
    isAdmin;
    isCurator;
    curatorId;
    favoriteLessons;
    completedLessons;
    completedModules;
    earnings;
    earningsHistory;
    achievements;
};
exports.User = User;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "avatarUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "currentAvatarLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "faculty", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "hasCompletedSorting", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "hasAcceptedRules", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "hasSeenWelcomeModal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isAdmin", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isCurator", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], User.prototype, "curatorId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                moduleId: { type: String, required: true },
                lessonNumber: { type: Number, required: true },
                addedAt: { type: Date, default: Date.now }
            }],
        default: []
    }),
    __metadata("design:type", Array)
], User.prototype, "favoriteLessons", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                moduleId: { type: String, required: true },
                lessonNumber: { type: Number, required: true },
                completedAt: { type: Date, default: Date.now }
            }],
        default: []
    }),
    __metadata("design:type", Array)
], User.prototype, "completedLessons", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], User.prototype, "completedModules", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "earnings", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                amount: { type: Number, required: true },
                date: { type: Date, required: true },
                description: String,
                createdAt: { type: Date, default: Date.now }
            }],
        default: []
    }),
    __metadata("design:type", Array)
], User.prototype, "earningsHistory", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                title: { type: String, required: true },
                description: { type: String, required: true },
                imageUrl: { type: String, required: true },
                awardedAt: { type: Date, default: Date.now }
            }],
        default: []
    }),
    __metadata("design:type", Array)
], User.prototype, "achievements", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
//# sourceMappingURL=user.schema.js.map