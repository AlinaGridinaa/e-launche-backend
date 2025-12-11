"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const avatars_controller_1 = require("./avatars.controller");
const avatar_level_schema_1 = require("../schemas/avatar-level.schema");
let AvatarsModule = class AvatarsModule {
};
exports.AvatarsModule = AvatarsModule;
exports.AvatarsModule = AvatarsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: avatar_level_schema_1.AvatarLevel.name, schema: avatar_level_schema_1.AvatarLevelSchema },
            ]),
        ],
        controllers: [avatars_controller_1.AvatarsController],
    })
], AvatarsModule);
//# sourceMappingURL=avatars.module.js.map