import * as webpush from 'web-push';
declare const vapidKeys: {
    publicKey: string;
    privateKey: string;
};
export declare function generateVapidKeys(): webpush.VapidKeys;
export { webpush, vapidKeys };
