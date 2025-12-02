import { Controller, Post, Delete, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationsService } from './notifications.service';
import { vapidKeys } from '../config/webpush.config';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // Отримати публічний VAPID ключ
  @Get('vapid-public-key')
  getVapidPublicKey() {
    console.log('📡 VAPID public key requested');
    console.log('   Public key:', vapidKeys.publicKey ? vapidKeys.publicKey.substring(0, 20) + '...' : 'UNDEFINED');
    
    if (!vapidKeys.publicKey) {
      console.error('❌ VAPID public key is not configured!');
      throw new Error('VAPID public key is not configured. Please set VAPID_PUBLIC_KEY environment variable.');
    }
    
    return { publicKey: vapidKeys.publicKey };
  }

  // Зберегти підписку
  @Post('subscribe')
  @UseGuards(JwtAuthGuard)
  async subscribe(@Request() req, @Body() subscription: any) {
    return this.notificationsService.saveSubscription(
      String(req.user._id),
      subscription,
    );
  }

  // Видалити підписку
  @Post('unsubscribe')
  @UseGuards(JwtAuthGuard)
  async unsubscribe(@Request() req, @Body('endpoint') endpoint: string) {
    return this.notificationsService.removeSubscription(
      String(req.user._id),
      endpoint,
    );
  }

  // Тестова нотифікація (тільки для авторизованих)
  @Post('test')
  @UseGuards(JwtAuthGuard)
  async sendTestNotification(@Request() req) {
    return this.notificationsService.sendNotificationToUser(
      String(req.user._id),
      {
        title: '🧙‍♂️ Тестова нотифікація',
        body: 'Вітаємо в Академії запусків!',
        icon: '/icons/icon-192.png',
        data: { url: '/home' },
      },
    );
  }
}
