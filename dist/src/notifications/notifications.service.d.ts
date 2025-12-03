import { Model } from 'mongoose';
import { PushSubscription, PushSubscriptionDocument } from '../schemas/push-subscription.schema';
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
export declare class NotificationsService {
    private pushSubscriptionModel;
    constructor(pushSubscriptionModel: Model<PushSubscriptionDocument>);
    saveSubscription(userId: string, subscription: any): Promise<{
        success: boolean;
        message: string;
    }>;
    removeSubscription(userId: string, endpoint: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getUserSubscriptions(userId: string): Promise<(import("mongoose").Document<unknown, {}, PushSubscriptionDocument, {}, {}> & PushSubscription & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    sendNotificationToUser(userId: string, payload: NotificationPayload): Promise<{
        sent: number;
        failed: number;
    }>;
    sendNotificationToAll(payload: NotificationPayload): Promise<{
        sent: number;
        failed: number;
    }>;
    notifyNewModule(moduleNumber: number, moduleTitle: string): Promise<{
        sent: number;
        failed: number;
    }>;
    notifyLiveStream(title: string, time: string, link: string): Promise<{
        sent: number;
        failed: number;
    }>;
    notifyHomeworkChecked(userId: string, lessonTitle: string, status: string): Promise<{
        sent: number;
        failed: number;
    }>;
    notifyNewAchievement(userId: string, achievementTitle: string): Promise<{
        sent: number;
        failed: number;
    }>;
    notifyUpcomingMeeting(title: string, time: string, link: string): Promise<{
        sent: number;
        failed: number;
    }>;
}
