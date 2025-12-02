import * as webpush from 'web-push';

// VAPID ключі для Web Push
// Згенеруйте нові ключі командою: npx web-push generate-vapid-keys
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY || '',
  privateKey: process.env.VAPID_PRIVATE_KEY || '',
};

const vapidEmail = process.env.VAPID_EMAIL || 'mailto:admin@hogwarts.com';

// Налаштування web-push
if (vapidKeys.publicKey && vapidKeys.privateKey) {
  webpush.setVapidDetails(
    vapidEmail,
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );
  console.log('✅ Web Push configured with VAPID keys');
} else {
  console.warn('⚠️ VAPID keys not configured! Push notifications will not work.');
}

// Функція для генерації нових VAPID ключів (для довідки)
export function generateVapidKeys() {
  return webpush.generateVAPIDKeys();
}

export { webpush, vapidKeys };
