import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getVapidPublicKey(): {
        publicKey: string;
    };
    subscribe(req: any, subscription: any): Promise<{
        success: boolean;
        message: string;
    }>;
    unsubscribe(req: any, endpoint: string): Promise<{
        success: boolean;
        message: string;
    }>;
    sendTestNotification(req: any): Promise<{
        sent: number;
        failed: number;
    }>;
}
