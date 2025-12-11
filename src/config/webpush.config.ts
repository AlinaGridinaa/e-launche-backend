import * as webpush from 'web-push';
import { config } from 'dotenv';

// Завантажуємо .env файл явно
config();

// VAPID ключі для Web Push
// Згенеруйте нові ключі командою: npx web-push generate-vapid-keys
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY || '',
  privateKey: process.env.VAPID_PRIVATE_KEY || '',
};

const vapidEmail = process.env.VAPID_EMAIL || 'mailto:admin@hogwarts.com';

console.log('🔧 Initializing Web Push configuration...');
console.log('   VAPID_PUBLIC_KEY exists:', !!process.env.VAPID_PUBLIC_KEY);
console.log('   VAPID_PRIVATE_KEY exists:', !!process.env.VAPID_PRIVATE_KEY);
console.log('   VAPID_EMAIL:', vapidEmail);

// Налаштування web-push
if (vapidKeys.publicKey && vapidKeys.privateKey) {
  try {
    webpush.setVapidDetails(
      vapidEmail,
      vapidKeys.publicKey,
      vapidKeys.privateKey
    );
    console.log('✅ Web Push configured successfully with VAPID keys');
    console.log('   Public key preview:', vapidKeys.publicKey.substring(0, 20) + '...');
  } catch (error) {
    console.error('❌ Failed to configure Web Push:', error);
  }
} else {
  console.error('❌ VAPID keys not configured! Push notifications will not work.');
  console.error('   Please set these environment variables:');
  console.error('   - VAPID_PUBLIC_KEY');
  console.error('   - VAPID_PRIVATE_KEY');
  console.error('   - VAPID_EMAIL (optional)');
  console.error('   Generate new keys with: npx web-push generate-vapid-keys');
}

// Функція для генерації нових VAPID ключів (для довідки)
export function generateVapidKeys() {
  return webpush.generateVAPIDKeys();
}

export { webpush, vapidKeys };
