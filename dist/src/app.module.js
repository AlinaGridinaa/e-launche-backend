"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const throttler_1 = require("@nestjs/throttler");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const dev_module_1 = require("./dev/dev.module");
const schedule_module_1 = require("./schedule/schedule.module");
const modules_module_1 = require("./modules/modules.module");
const favorites_module_1 = require("./favorites/favorites.module");
const profile_module_1 = require("./profile/profile.module");
const progress_module_1 = require("./progress/progress.module");
const admin_module_1 = require("./admin/admin.module");
const curator_module_1 = require("./curator/curator.module");
const homework_module_1 = require("./homework/homework.module");
const achievements_module_1 = require("./achievements/achievements.module");
const notifications_module_1 = require("./notifications/notifications.module");
const avatars_module_1 = require("./avatars/avatars.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    uri: configService.get('MONGODB_URI'),
                }),
                inject: [config_1.ConfigService],
            }),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 10,
                }]),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'uploads'),
                serveRoot: '/api/uploads',
            }),
            auth_module_1.AuthModule,
            dev_module_1.DevModule,
            schedule_module_1.ScheduleModule,
            modules_module_1.ModulesModule,
            favorites_module_1.FavoritesModule,
            profile_module_1.ProfileModule,
            progress_module_1.ProgressModule,
            admin_module_1.AdminModule,
            curator_module_1.CuratorModule,
            homework_module_1.HomeworkModule,
            achievements_module_1.AchievementsModule,
            notifications_module_1.NotificationsModule,
            avatars_module_1.AvatarsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map