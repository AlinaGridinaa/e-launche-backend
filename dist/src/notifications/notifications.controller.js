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
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const notifications_service_1 = require("./notifications.service");
const webpush_config_1 = require("../config/webpush.config");
let NotificationsController = class NotificationsController {
    notificationsService;
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    getVapidPublicKey() {
        console.log('📡 VAPID public key requested');
        console.log('   Public key:', webpush_config_1.vapidKeys.publicKey ? webpush_config_1.vapidKeys.publicKey.substring(0, 20) + '...' : 'UNDEFINED');
        if (!webpush_config_1.vapidKeys.publicKey) {
            console.error('❌ VAPID public key is not configured!');
            throw new Error('VAPID public key is not configured. Please set VAPID_PUBLIC_KEY environment variable.');
        }
        return { publicKey: webpush_config_1.vapidKeys.publicKey };
    }
    async subscribe(req, subscription) {
        return this.notificationsService.saveSubscription(String(req.user._id), subscription);
    }
    async unsubscribe(req, endpoint) {
        return this.notificationsService.removeSubscription(String(req.user._id), endpoint);
    }
    async sendTestNotification(req) {
        return this.notificationsService.sendNotificationToUser(String(req.user._id), {
            title: '🧙‍♂️ Тестова нотифікація',
            body: 'Вітаємо в Академії запусків!',
            icon: '/icons/icon-192.png',
            data: { url: '/home' },
        });
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Get)('vapid-public-key'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "getVapidPublicKey", null);
__decorate([
    (0, common_1.Post)('subscribe'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "subscribe", null);
__decorate([
    (0, common_1.Post)('unsubscribe'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('endpoint')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "unsubscribe", null);
__decorate([
    (0, common_1.Post)('test'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendTestNotification", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map