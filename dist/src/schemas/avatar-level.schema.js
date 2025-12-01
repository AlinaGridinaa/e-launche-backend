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
exports.AvatarLevelSchema = exports.AvatarLevel = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let AvatarLevel = class AvatarLevel {
    level;
    imageUrl;
    description;
};
exports.AvatarLevel = AvatarLevel;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", Number)
], AvatarLevel.prototype, "level", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AvatarLevel.prototype, "imageUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AvatarLevel.prototype, "description", void 0);
exports.AvatarLevel = AvatarLevel = __decorate([
    (0, mongoose_1.Schema)()
], AvatarLevel);
exports.AvatarLevelSchema = mongoose_1.SchemaFactory.createForClass(AvatarLevel);
//# sourceMappingURL=avatar-level.schema.js.map