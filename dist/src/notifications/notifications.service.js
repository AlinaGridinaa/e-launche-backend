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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const push_subscription_schema_1 = require("../schemas/push-subscription.schema");
const webpush_config_1 = require("../config/webpush.config");
let NotificationsService = class NotificationsService {
    pushSubscriptionModel;
    constructor(pushSubscriptionModel) {
        this.pushSubscriptionModel = pushSubscriptionModel;
    }
    async saveSubscription(userId, subscription) {
        console.log(`Saving subscription for userId: ${userId}`);
        await this.pushSubscriptionModel.deleteMany({
            userId,
            endpoint: subscription.endpoint,
        });
        const newSubscription = new this.pushSubscriptionModel({
            userId,
            endpoint: subscription.endpoint,
            p256dh: subscription.keys.p256dh,
            auth: subscription.keys.auth,
            isActive: true,
        });
        await newSubscription.save();
        console.log(`Subscription saved with userId: ${newSubscription.userId}`);
        return { success: true, message: 'Підписку збережено' };
    }
    async removeSubscription(userId, endpoint) {
        await this.pushSubscriptionModel.deleteMany({ userId, endpoint });
        return { success: true, message: 'Підписку видалено' };
    }
    async getUserSubscriptions(userId) {
        return this.pushSubscriptionModel.find({ userId, isActive: true });
    }
    async sendNotificationToUser(userId, payload) {
        console.log(`Looking for subscriptions for userId: ${userId}`);
        const allSubs = await this.pushSubscriptionModel.find({}).limit(5);
        console.log(`Sample subscriptions in DB:`, allSubs.map(s => ({ userId: s.userId, isActive: s.isActive })));
        const subscriptions = await this.getUserSubscriptions(userId);
        console.log(`Found ${subscriptions.length} subscriptions for user ${userId}`);
        if (subscriptions.length === 0) {
            console.log(`No active subscriptions for user ${userId}`);
            return { sent: 0, failed: 0 };
        }
        let sent = 0;
        let failed = 0;
        for (const subscription of subscriptions) {
            try {
                const pushSubscription = {
                    endpoint: subscription.endpoint,
                    keys: {
                        p256dh: subscription.p256dh,
                        auth: subscription.auth,
                    },
                };
                await webpush_config_1.webpush.sendNotification(pushSubscription, JSON.stringify(payload));
                sent++;
            }
            catch (error) {
                console.error('Failed to send notification:', error);
                failed++;
                if (error.statusCode === 410 || error.statusCode === 404) {
                    subscription.isActive = false;
                    await subscription.save();
                }
            }
        }
        return { sent, failed };
    }
    async sendNotificationToAll(payload) {
        const subscriptions = await this.pushSubscriptionModel.find({ isActive: true });
        let sent = 0;
        let failed = 0;
        for (const subscription of subscriptions) {
            try {
                const pushSubscription = {
                    endpoint: subscription.endpoint,
                    keys: {
                        p256dh: subscription.p256dh,
                        auth: subscription.auth,
                    },
                };
                await webpush_config_1.webpush.sendNotification(pushSubscription, JSON.stringify(payload));
                sent++;
            }
            catch (error) {
                console.error('Failed to send notification:', error);
                failed++;
                if (error.statusCode === 410 || error.statusCode === 404) {
                    subscription.isActive = false;
                    await subscription.save();
                }
            }
        }
        return { sent, failed };
    }
    async notifyNewModule(moduleNumber, moduleTitle) {
        return this.sendNotificationToAll({
            title: '🎓 Новий модуль доступний!',
            body: `Модуль ${moduleNumber}: ${moduleTitle}`,
            icon: '/icons/icon-192.png',
            badge: '/icons/icon-192.png',
            data: { url: '/modules' },
        });
    }
    async notifyLiveStream(title, time, link) {
        return this.sendNotificationToAll({
            title: '🔴 Прямий ефір',
            body: `${title} - ${time}`,
            icon: '/icons/icon-192.png',
            data: { url: link || '/schedule' },
            actions: [
                { action: 'open', title: 'Приєднатися' },
            ],
        });
    }
    async notifyHomeworkChecked(userId, lessonTitle, status) {
        const emoji = status === 'approved' ? '✅' : status === 'needs_revision' ? '📝' : '❌';
        const statusText = status === 'approved' ? 'схвалено' : status === 'needs_revision' ? 'потребує доопрацювання' : 'відхилено';
        return this.sendNotificationToUser(userId, {
            title: `${emoji} Домашнє завдання перевірено`,
            body: `${lessonTitle}: ${statusText}`,
            icon: '/icons/icon-192.png',
            data: { url: '/homework' },
        });
    }
    async notifyNewAchievement(userId, achievementTitle) {
        return this.sendNotificationToUser(userId, {
            title: '🏆 Нова нагорода!',
            body: achievementTitle,
            icon: '/icons/icon-192.png',
            data: { url: '/achievements' },
        });
    }
    async notifyUpcomingMeeting(title, time, link) {
        return this.sendNotificationToAll({
            title: '📞 Нагадування про зустріч',
            body: `${title} через ${time}`,
            icon: '/icons/icon-192.png',
            data: { url: link },
            actions: [
                { action: 'open', title: 'Відкрити посилання' },
            ],
        });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(push_subscription_schema_1.PushSubscription.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map