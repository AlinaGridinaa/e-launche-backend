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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = __importStar(require("bcryptjs"));
const user_schema_1 = require("../schemas/user.schema");
const schedule_event_schema_1 = require("../schemas/schedule-event.schema");
const modules_service_1 = require("../modules/modules.service");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let DevController = class DevController {
    userModel;
    scheduleModel;
    modulesService;
    constructor(userModel, scheduleModel, modulesService) {
        this.userModel = userModel;
        this.scheduleModel = scheduleModel;
        this.modulesService = modulesService;
    }
    async seed() {
        try {
            await this.userModel.deleteMany({});
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
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }
    async seedSchedule() {
        try {
            await this.scheduleModel.deleteMany({});
            const events = [
                {
                    title: 'Старт навчання',
                    description: 'Відкриття навчальної платформи, Формування Telegram-чатів, Знайомство з кураторами',
                    date: new Date('2025-12-01'),
                    type: schedule_event_schema_1.EventType.PLATFORM_OPENING,
                    tags: ['всі', 'початок'],
                },
                {
                    title: 'Прямий ефір від ректора',
                    description: 'Вступний ефір',
                    date: new Date('2025-12-02T20:00:00'),
                    time: '20:00',
                    timeEurope: '19:00',
                    type: schedule_event_schema_1.EventType.LIVE_STREAM,
                    speaker: 'Ректор',
                    tags: ['всі', 'ефір'],
                },
                {
                    title: 'Перший модуль',
                    description: 'Відкриття уроків 1 модуля',
                    date: new Date('2025-12-03'),
                    type: schedule_event_schema_1.EventType.MODULE_OPENING,
                    tags: ['всі', 'модуль'],
                },
                {
                    title: 'Zoom-зустріч з Олегом Лобановим',
                    description: 'Розбори в прямому ефірі (для досвідчених студентів)',
                    date: new Date('2025-12-04T20:00:00'),
                    time: '20:00',
                    timeEurope: '19:00',
                    type: schedule_event_schema_1.EventType.ZOOM_MEETING,
                    speaker: 'Олег Лобанов',
                    tags: ['досвідчені', 'zoom'],
                },
                {
                    title: 'Zoom-ефіри: Знайомство з кураторами',
                    description: 'В кожній групі буде своя дата і час. Узгодимо в чаті',
                    date: new Date('2025-12-05'),
                    type: schedule_event_schema_1.EventType.GROUP_MEETING,
                    tags: ['всі', 'куратори'],
                    notes: 'Дати 5-6 грудня, конкретний час буде узгоджено в групових чатах',
                },
                {
                    title: 'Прямий ефір від ректора',
                    description: 'Швидкі результати',
                    date: new Date('2025-12-08T20:00:00'),
                    time: '20:00',
                    timeEurope: '19:00',
                    type: schedule_event_schema_1.EventType.LIVE_STREAM,
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
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }
    async fixFaculty() {
        try {
            const user = await this.userModel.findOne({ email: 'test@hogwarts.com' });
            if (!user) {
                return {
                    success: false,
                    message: 'User not found',
                };
            }
            user.faculty = 'Продюсер';
            await user.save();
            return {
                success: true,
                message: 'Faculty updated successfully',
                user: {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    faculty: user.faculty,
                },
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }
    async resetWelcomeModal() {
        try {
            const user = await this.userModel.findOne({ email: 'test@hogwarts.com' });
            if (!user) {
                return {
                    success: false,
                    message: 'User not found',
                };
            }
            user.hasSeenWelcomeModal = false;
            await user.save();
            return {
                success: true,
                message: 'Welcome modal reset successfully',
                user: {
                    email: user.email,
                    hasSeenWelcomeModal: user.hasSeenWelcomeModal,
                    faculty: user.faculty,
                },
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }
    async seedModules() {
        try {
            await this.modulesService.deleteAll();
            const csvPath = path.join(process.cwd(), '..', 'frontend', 'Программа 5 поток Академии запусков - Лист1.csv');
            const csvContent = fs.readFileSync(csvPath, 'utf-8');
            const rows = this.parseCSV(csvContent);
            const modules = [];
            let currentModule = null;
            for (const columns of rows) {
                const moduleTitle = columns[0]?.trim();
                const lessonUrl = columns[1]?.trim();
                const materials = columns[2]?.trim();
                const homework = columns[3]?.trim();
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
                            isLocked: false,
                            lessons: [],
                            progress: 0,
                            category: 'Навчання',
                        };
                    }
                }
                else if (moduleTitle && moduleTitle.startsWith('Урок') && currentModule) {
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
            if (currentModule) {
                modules.push(currentModule);
            }
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
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                stack: error.stack,
            };
        }
    }
    parseCSV(content) {
        const rows = [];
        const chars = content.split('');
        let current = '';
        let currentRow = [];
        let inQuotes = false;
        let i = 0;
        while (i < chars.length) {
            const char = chars[i];
            if (char === '"') {
                if (inQuotes && chars[i + 1] === '"') {
                    current += '"';
                    i += 2;
                    continue;
                }
                inQuotes = !inQuotes;
                i++;
            }
            else if (char === ',' && !inQuotes) {
                currentRow.push(current);
                current = '';
                i++;
            }
            else if ((char === '\n' || char === '\r') && !inQuotes) {
                if (char === '\r' && chars[i + 1] === '\n') {
                    i++;
                }
                currentRow.push(current);
                if (currentRow.some(cell => cell.trim())) {
                    rows.push(currentRow);
                }
                currentRow = [];
                current = '';
                i++;
            }
            else {
                current += char;
                i++;
            }
        }
        if (current || currentRow.length > 0) {
            currentRow.push(current);
            if (currentRow.some(cell => cell.trim())) {
                rows.push(currentRow);
            }
        }
        return rows.slice(1);
    }
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            }
            else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            }
            else {
                current += char;
            }
        }
        result.push(current);
        return result;
    }
    parseMaterials(materialsText) {
        if (!materialsText)
            return [];
        const materials = [];
        const lines = materialsText.split('\n');
        let currentTitle = '';
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine)
                continue;
            if (trimmedLine.startsWith('http')) {
                const url = trimmedLine;
                let type = 'link';
                if (url.includes('youtube.com') || url.includes('youtu.be')) {
                    type = 'video';
                }
                else if (url.includes('.pdf')) {
                    type = 'pdf';
                }
                else if (url.includes('docs.google.com/spreadsheets')) {
                    type = 'spreadsheet';
                }
                else if (url.includes('docs.google.com/document')) {
                    type = 'document';
                }
                else if (url.includes('drive.google.com')) {
                    type = 'file';
                }
                materials.push({
                    type,
                    title: currentTitle || 'Матеріал',
                    url,
                });
                currentTitle = '';
            }
            else {
                currentTitle = trimmedLine;
            }
        }
        return materials;
    }
};
exports.DevController = DevController;
__decorate([
    (0, common_1.Post)('seed'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DevController.prototype, "seed", null);
__decorate([
    (0, common_1.Post)('seed-schedule'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DevController.prototype, "seedSchedule", null);
__decorate([
    (0, common_1.Post)('fix-faculty'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DevController.prototype, "fixFaculty", null);
__decorate([
    (0, common_1.Post)('reset-welcome-modal'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DevController.prototype, "resetWelcomeModal", null);
__decorate([
    (0, common_1.Post)('seed-modules'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DevController.prototype, "seedModules", null);
exports.DevController = DevController = __decorate([
    (0, common_1.Controller)('dev'),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(schedule_event_schema_1.ScheduleEvent.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        modules_service_1.ModulesService])
], DevController);
//# sourceMappingURL=dev.controller.js.map