import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../schemas/user.schema';
import { ScheduleEvent, ScheduleEventDocument, EventType } from '../schemas/schedule-event.schema';
import { ModulesService } from '../modules/modules.service';
import * as fs from 'fs';
import * as path from 'path';

@Controller('dev')
export class DevController {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(ScheduleEvent.name) private scheduleModel: Model<ScheduleEventDocument>,
    private modulesService: ModulesService,
  ) {}

  @Post('seed')
  @HttpCode(HttpStatus.OK)
  async seed() {
    try {
      // Видаляємо старих користувачів
      await this.userModel.deleteMany({});

      // Створюємо тестового користувача
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      const user = await this.userModel.create({
        email: 'test@hogwarts.com',
        password: hashedPassword,
        firstName: 'Гаррі',
        lastName: 'Поттер',
        phone: '+380501234567',
        faculty: 'Гріфіндор',
        hasCompletedSorting: true,
        hasAcceptedRules: true,
      });

      // Створюємо адмін користувача
      const admin = await this.userModel.create({
        email: 'admin@hogwarts.com',
        password: await bcrypt.hash('admin123', 10),
        firstName: 'Альбус',
        lastName: 'Дамблдор',
        isAdmin: true,
        hasCompletedSorting: true,
        hasAcceptedRules: true,
      });

      return {
        success: true,
        message: 'Test users created',
        users: [
          { email: user.email, password: 'password123' },
          { email: admin.email, password: 'admin123' },
        ],
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Post('seed-schedule')
  @HttpCode(HttpStatus.OK)
  async seedSchedule() {
    try {
      // Видаляємо старі події
      await this.scheduleModel.deleteMany({});

      const events = [
        {
          title: 'Старт навчання',
          description: 'Відкриття навчальної платформи, Формування Telegram-чатів, Знайомство з кураторами',
          date: new Date('2025-12-01'),
          type: EventType.PLATFORM_OPENING,
          tags: ['всі', 'початок'],
        },
        {
          title: 'Прямий ефір від ректора',
          description: 'Вступний ефір',
          date: new Date('2025-12-02T20:00:00'),
          time: '20:00',
          timeEurope: '19:00',
          type: EventType.LIVE_STREAM,
          speaker: 'Ректор',
          tags: ['всі', 'ефір'],
        },
        {
          title: 'Перший модуль',
          description: 'Відкриття уроків 1 модуля',
          date: new Date('2025-12-03'),
          type: EventType.MODULE_OPENING,
          tags: ['всі', 'модуль'],
        },
        {
          title: 'Zoom-зустріч з Олегом Лобановим',
          description: 'Розбори в прямому ефірі (для досвідчених студентів)',
          date: new Date('2025-12-04T20:00:00'),
          time: '20:00',
          timeEurope: '19:00',
          type: EventType.ZOOM_MEETING,
          speaker: 'Олег Лобанов',
          tags: ['досвідчені', 'zoom'],
        },
        {
          title: 'Zoom-ефіри: Знайомство з кураторами',
          description: 'В кожній групі буде своя дата і час. Узгодимо в чаті',
          date: new Date('2025-12-05'),
          type: EventType.GROUP_MEETING,
          tags: ['всі', 'куратори'],
          notes: 'Дати 5-6 грудня, конкретний час буде узгоджено в групових чатах',
        },
        {
          title: 'Прямий ефір від ректора',
          description: 'Швидкі результати',
          date: new Date('2025-12-08T20:00:00'),
          time: '20:00',
          timeEurope: '19:00',
          type: EventType.LIVE_STREAM,
          speaker: 'Ректор',
          tags: ['всі', 'ефір'],
        },
      ];

      const createdEvents = await this.scheduleModel.insertMany(events);

      return {
        success: true,
        message: 'Schedule events created',
        count: createdEvents.length,
        events: createdEvents,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Post('seed-modules')
  @HttpCode(HttpStatus.OK)
  async seedModules() {
    try {
      // Видаляємо старі модулі
      await this.modulesService.deleteAll();

      const csvPath = path.join(process.cwd(), '..', 'frontend', 'Программа 5 поток Академии запусков - Лист1.csv');
      const csvContent = fs.readFileSync(csvPath, 'utf-8');
      
      // Parse CSV properly handling multi-line fields in quotes
      const rows = this.parseCSV(csvContent);
      const modules: any[] = [];
      let currentModule: any = null;

      for (const columns of rows) {
        const moduleTitle = columns[0]?.trim();
        const lessonUrl = columns[1]?.trim();
        const materials = columns[2]?.trim();
        const homework = columns[3]?.trim();

        // Check if this is a module header
        if (moduleTitle && moduleTitle.startsWith('Модуль')) {
          if (currentModule) {
            modules.push(currentModule);
          }

          const moduleMatch = moduleTitle.match(/Модуль (\d+)[.\s]+(.*)/);
          if (moduleMatch) {
            currentModule = {
              number: parseInt(moduleMatch[1], 10),
              title: moduleMatch[2].trim(),
              description: '',
              isLocked: false, // Will be set later based on lesson count
              lessons: [],
              progress: 0,
              category: 'Навчання',
            };
          }
        } else if (moduleTitle && moduleTitle.startsWith('Урок') && currentModule) {
          // This is a lesson
          const lessonMatch = moduleTitle.match(/Урок (\d+)[.\s]+(.*)/);
          if (lessonMatch) {
            const lessonNumber = parseInt(lessonMatch[1], 10);
            const lessonTitle = lessonMatch[2].trim();

            const lesson = {
              number: lessonNumber,
              title: lessonTitle,
              videoUrl: lessonUrl || '',
              description: '',
              materials: this.parseMaterials(materials),
              homework: homework || '',
              duration: 0,
              isCompleted: false,
            };

            currentModule.lessons.push(lesson);
          }
        }
      }

      // Push last module
      if (currentModule) {
        modules.push(currentModule);
      }

      // Mark modules as locked if they have no lessons
      modules.forEach(module => {
        if (module.lessons.length === 0) {
          module.isLocked = true;
        }
      });

      const createdModules = await this.modulesService.createMany(modules);

      return {
        success: true,
        message: 'Modules seeded successfully',
        count: createdModules.length,
        modules: createdModules.map(m => ({
          number: m.number,
          title: m.title,
          lessonCount: m.lessons.length,
          isLocked: m.isLocked,
        })),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        stack: error.stack,
      };
    }
  }

  private parseCSV(content: string): string[][] {
    const rows: string[][] = [];
    const chars = content.split('');
    let current = '';
    let currentRow: string[] = [];
    let inQuotes = false;
    let i = 0;

    while (i < chars.length) {
      const char = chars[i];

      if (char === '"') {
        // Check if it's an escaped quote (double quotes)
        if (inQuotes && chars[i + 1] === '"') {
          current += '"';
          i += 2;
          continue;
        }
        inQuotes = !inQuotes;
        i++;
      } else if (char === ',' && !inQuotes) {
        currentRow.push(current);
        current = '';
        i++;
      } else if ((char === '\n' || char === '\r') && !inQuotes) {
        // Handle different line endings
        if (char === '\r' && chars[i + 1] === '\n') {
          i++; // Skip \r in \r\n
        }
        currentRow.push(current);
        if (currentRow.some(cell => cell.trim())) {
          rows.push(currentRow);
        }
        currentRow = [];
        current = '';
        i++;
      } else {
        current += char;
        i++;
      }
    }

    // Push last row if exists
    if (current || currentRow.length > 0) {
      currentRow.push(current);
      if (currentRow.some(cell => cell.trim())) {
        rows.push(currentRow);
      }
    }

    // Skip header row
    return rows.slice(1);
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);

    return result;
  }

  private parseMaterials(materialsText: string): any[] {
    if (!materialsText) return [];

    const materials: any[] = [];
    const lines = materialsText.split('\n');
    
    let currentTitle = '';
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      if (trimmedLine.startsWith('http')) {
        // This is a URL
        const url = trimmedLine;
        let type = 'link';
        
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
          type = 'video';
        } else if (url.includes('.pdf')) {
          type = 'pdf';
        } else if (url.includes('docs.google.com/spreadsheets')) {
          type = 'spreadsheet';
        } else if (url.includes('docs.google.com/document')) {
          type = 'document';
        } else if (url.includes('drive.google.com')) {
          type = 'file';
        }

        materials.push({
          type,
          title: currentTitle || 'Матеріал',
          url,
        });
        currentTitle = '';
      } else {
        // This is a title
        currentTitle = trimmedLine;
      }
    }

    return materials;
  }
}
