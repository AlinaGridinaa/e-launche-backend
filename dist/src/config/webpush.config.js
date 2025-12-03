"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.vapidKeys = exports.webpush = void 0;
exports.generateVapidKeys = generateVapidKeys;
const webpush = __importStar(require("web-push"));
exports.webpush = webpush;
const vapidKeys = {
    publicKey: process.env.VAPID_PUBLIC_KEY || '',
    privateKey: process.env.VAPID_PRIVATE_KEY || '',
};
exports.vapidKeys = vapidKeys;
const vapidEmail = process.env.VAPID_EMAIL || 'mailto:admin@hogwarts.com';
console.log('🔧 Initializing Web Push configuration...');
console.log('   VAPID_PUBLIC_KEY exists:', !!process.env.VAPID_PUBLIC_KEY);
console.log('   VAPID_PRIVATE_KEY exists:', !!process.env.VAPID_PRIVATE_KEY);
console.log('   VAPID_EMAIL:', vapidEmail);
if (vapidKeys.publicKey && vapidKeys.privateKey) {
    try {
        webpush.setVapidDetails(vapidEmail, vapidKeys.publicKey, vapidKeys.privateKey);
        console.log('✅ Web Push configured successfully with VAPID keys');
        console.log('   Public key preview:', vapidKeys.publicKey.substring(0, 20) + '...');
    }
    catch (error) {
        console.error('❌ Failed to configure Web Push:', error);
    }
}
else {
    console.error('❌ VAPID keys not configured! Push notifications will not work.');
    console.error('   Please set these environment variables:');
    console.error('   - VAPID_PUBLIC_KEY');
    console.error('   - VAPID_PRIVATE_KEY');
    console.error('   - VAPID_EMAIL (optional)');
    console.error('   Generate new keys with: npx web-push generate-vapid-keys');
}
function generateVapidKeys() {
    return webpush.generateVAPIDKeys();
}
//# sourceMappingURL=webpush.config.js.map