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
const mongoose = __importStar(require("mongoose"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hogwarts';
const scheduleEvents = [
    {
        date: new Date('2024-12-01T00:00:00Z'),
        title: 'Старт навчання',
        description: 'Розклад у каналі передзапису',
        type: 'platform_opening',
        isCompleted: true,
    },
    {
        date: new Date('2024-12-02T18:00:00Z'),
        title: 'Прямий ефір від ректора',
        description: 'Тема: «Як отримати максимум від навчання?»',
        time: '20:00 за Києвом',
        timeEurope: '19:00 за Європою',
        type: 'live_stream',
        isCompleted: true,
    },
    {
        date: new Date('2024-12-03T00:00:00Z'),
        title: 'Відкриття навчальної платформи та першого модуля',
        description: '• Відкриття навчальної платформи\n• Відкриття уроків 1 модуля',
        type: 'platform_opening',
        isCompleted: true,
    },
    {
        date: new Date('2024-12-03T18:00:00Z'),
        title: 'Zoom-зустріч з Олегом Лобановим',
        description: 'Тема: Розбори в прямому ефірі',
        time: '20:00 за Києвом',
        timeEurope: '19:00 за Європою',
        type: 'zoom_meeting',
        isCompleted: true,
    },
    {
        date: new Date('2024-12-05T00:00:00Z'),
        title: 'Формування Telegram-чатів',
        description: '• Надсилаємо посилання на чати з кураторами в особисті повідомлення\n• Завдання на знайомство в чаті',
        notes: '5–7 грудня',
        type: 'group_meeting',
        isCompleted: false,
    },
    {
        date: new Date('2024-12-08T18:00:00Z'),
        title: 'Онлайн-урок від ректора',
        description: 'Тема: «Формула запуску для швидкого старту»',
        time: '20:00 за Києвом',
        timeEurope: '19:00 за Європою',
        type: 'live_stream',
        isCompleted: false,
    },
];
async function updateSchedule() {
    try {
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        const ScheduleEvent = mongoose.model('ScheduleEvent', new mongoose.Schema({
            date: Date,
            title: String,
            description: String,
            time: String,
            timeEurope: String,
            speaker: String,
            type: String,
            notes: String,
            tags: [String],
            isCompleted: Boolean,
        }));
        console.log('🗑️  Removing old December events...');
        await ScheduleEvent.deleteMany({
            date: {
                $gte: new Date('2024-12-01T00:00:00Z'),
                $lt: new Date('2025-01-01T00:00:00Z'),
            },
        });
        console.log('➕ Adding new schedule events...');
        await ScheduleEvent.insertMany(scheduleEvents);
        console.log('✅ Schedule updated successfully!');
        console.log(`🗓 Added ${scheduleEvents.length} events`);
        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
    }
    catch (error) {
        console.error('❌ Error updating schedule:', error);
        process.exit(1);
    }
}
updateSchedule();
//# sourceMappingURL=update-schedule-dec.js.map