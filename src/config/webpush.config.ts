import * as webpush from 'web-push';

// VAPID ключі для Web Push
// Згенеруйте нові ключі командою: npx web-push generate-vapid-keys
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY || '',
  privateKey: process.env.VAPID_PRIVATE_KEY || '',
};

// Налаштування web-push
webpush.setVapidDetails(
  'mailto:admin@hogwarts.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export { webpush, vapidKeys };
