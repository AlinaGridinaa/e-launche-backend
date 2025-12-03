import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Завантажуємо .env файл
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

    // Видаляємо старі події грудня
    console.log('🗑️  Removing old December events...');
    await ScheduleEvent.deleteMany({
      date: {
        $gte: new Date('2024-12-01T00:00:00Z'),
        $lt: new Date('2025-01-01T00:00:00Z'),
      },
    });

    // Додаємо нові події
    console.log('➕ Adding new schedule events...');
    await ScheduleEvent.insertMany(scheduleEvents);

    console.log('✅ Schedule updated successfully!');
    console.log(`🗓 Added ${scheduleEvents.length} events`);

    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error updating schedule:', error);
    process.exit(1);
  }
}

updateSchedule();
