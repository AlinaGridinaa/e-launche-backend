import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PushSubscription, PushSubscriptionDocument } from '../schemas/push-subscription.schema';
import { webpush } from '../config/webpush.config';

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
  }>;
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(PushSubscription.name)
    private pushSubscriptionModel: Model<PushSubscriptionDocument>,
  ) {}

  // Зберегти підписку користувача
  async saveSubscription(userId: string, subscription: any) {
    // Видаляємо старі підписки цього користувача для цього endpoint
    await this.pushSubscriptionModel.deleteMany({
      userId,
      endpoint: subscription.endpoint,
    });

    // Створюємо нову підписку
    const newSubscription = new this.pushSubscriptionModel({
      userId,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      isActive: true,
    });

    await newSubscription.save();

    return { success: true, message: 'Підписку збережено' };
  }

  // Видалити підписку
  async removeSubscription(userId: string, endpoint: string) {
    await this.pushSubscriptionModel.deleteMany({ userId, endpoint });
    return { success: true, message: 'Підписку видалено' };
  }

  // Отримати всі активні підписки користувача
  async getUserSubscriptions(userId: string) {
    return this.pushSubscriptionModel.find({ userId, isActive: true });
  }

  // Відправити нотифікацію одному користувачу
  async sendNotificationToUser(userId: string, payload: NotificationPayload) {
    const subscriptions = await this.getUserSubscriptions(userId);

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

        await webpush.sendNotification(
          pushSubscription,
          JSON.stringify(payload),
        );

        sent++;
      } catch (error: any) {
        console.error('Failed to send notification:', error);
        failed++;

        // Якщо підписка більше не валідна, деактивуємо її
        if (error.statusCode === 410 || error.statusCode === 404) {
          subscription.isActive = false;
          await subscription.save();
        }
      }
    }

    return { sent, failed };
  }

  // Відправити нотифікацію всім користувачам
  async sendNotificationToAll(payload: NotificationPayload) {
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

        await webpush.sendNotification(
          pushSubscription,
          JSON.stringify(payload),
        );

        sent++;
      } catch (error: any) {
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

  // Відправити нотифікацію про новий модуль
  async notifyNewModule(moduleNumber: number, moduleTitle: string) {
    return this.sendNotificationToAll({
      title: '🎓 Новий модуль доступний!',
      body: `Модуль ${moduleNumber}: ${moduleTitle}`,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: { url: '/modules' },
    });
  }

  // Відправити нотифікацію про прямий ефір
  async notifyLiveStream(title: string, time: string, link: string) {
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

  // Відправити нотифікацію про перевірене ДЗ
  async notifyHomeworkChecked(userId: string, lessonTitle: string, status: string) {
    const emoji = status === 'approved' ? '✅' : status === 'needs_revision' ? '📝' : '❌';
    const statusText = status === 'approved' ? 'схвалено' : status === 'needs_revision' ? 'потребує доопрацювання' : 'відхилено';

    return this.sendNotificationToUser(userId, {
      title: `${emoji} Домашнє завдання перевірено`,
      body: `${lessonTitle}: ${statusText}`,
      icon: '/icons/icon-192.png',
      data: { url: '/homework' },
    });
  }

  // Відправити нотифікацію про нову нагороду
  async notifyNewAchievement(userId: string, achievementTitle: string) {
    return this.sendNotificationToUser(userId, {
      title: '🏆 Нова нагорода!',
      body: achievementTitle,
      icon: '/icons/icon-192.png',
      data: { url: '/achievements' },
    });
  }

  // Відправити нагадування про зустріч
  async notifyUpcomingMeeting(title: string, time: string, link: string) {
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
}
