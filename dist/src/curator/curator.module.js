"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CuratorModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const curator_controller_1 = require("./curator.controller");
const curator_service_1 = require("./curator.service");
const homework_schema_1 = require("../schemas/homework.schema");
const user_schema_1 = require("../schemas/user.schema");
const module_schema_1 = require("../schemas/module.schema");
let CuratorModule = class CuratorModule {
};
exports.CuratorModule = CuratorModule;
exports.CuratorModule = CuratorModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: homework_schema_1.Homework.name, schema: homework_schema_1.HomeworkSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: module_schema_1.Module.name, schema: module_schema_1.ModuleSchema },
            ]),
        ],
        controllers: [curator_controller_1.CuratorController],
        providers: [curator_service_1.CuratorService],
    })
], CuratorModule);
//# sourceMappingURL=curator.module.js.map