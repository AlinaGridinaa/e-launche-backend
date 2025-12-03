"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AchievementSchema = exports.Achievement = exports.ACHIEVEMENT_TYPES = exports.UserAchievementSchema = exports.UserAchievement = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let UserAchievement = class UserAchievement {
    userId;
    achievementId;
    proofText;
    proofFile;
    proofLink;
    status;
    curatorComment;
    submittedAt;
    approvedAt;
};
exports.UserAchievement = UserAchievement;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], UserAchievement.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], UserAchievement.prototype, "achievementId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], UserAchievement.prototype, "proofText", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], UserAchievement.prototype, "proofFile", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], UserAchievement.prototype, "proofLink", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'pending' }),
    __metadata("design:type", String)
], UserAchievement.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], UserAchievement.prototype, "curatorComment", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], UserAchievement.prototype, "submittedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], UserAchievement.prototype, "approvedAt", void 0);
exports.UserAchievement = UserAchievement = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], UserAchievement);
exports.UserAchievementSchema = mongoose_1.SchemaFactory.createForClass(UserAchievement);
exports.ACHIEVEMENT_TYPES = [
    {
        id: 'first_sale',
        title: 'Перша продажа',
        emoji: '💸',
        description: 'Отримали першу оплату за продукт або послугу.',
        category: 'sales',
    },
    {
        id: 'three_sales',
        title: 'Три продажі',
        emoji: '🔥',
        description: 'Зробили 3 продажі поспіль — стабільність починає рости.',
        category: 'sales',
    },
    {
        id: 'first_100',
        title: 'Перші 100$',
        emoji: '💵',
        description: 'Перший дохід у 100$ — важливий старт.',
        category: 'sales',
    },
    {
        id: 'first_1000',
        title: 'Перша тисяча',
        emoji: '💰',
        description: 'Досягнули перших 1000$ — новий рівень.',
        category: 'sales',
    },
    {
        id: 'start_post',
        title: 'Стартовий крок',
        emoji: '🚀',
        description: 'Опублікували пост про початок навчання — публічний намір рухатися вперед.',
        category: 'social',
    },
    {
        id: 'online_presence',
        title: 'Онлайн-присутність',
        emoji: '🖥️',
        description: 'Скріншот вашої участі у онлайн-уроці Дмитра.',
        category: 'progress',
    },
    {
        id: 'weekly_results',
        title: 'Навчальний тиждень',
        emoji: '🗓',
        description: 'Позначка у сторіс про ваші результати за тиждень.',
        category: 'progress',
    },
    {
        id: 'expert_found',
        title: 'Знайдений експерт',
        emoji: '🤝',
        description: 'Скріншот про те, що експерта обрано. Уклали першу домовленість про співпрацю.',
        category: 'progress',
    },
    {
        id: 'expert_live',
        title: 'Ефір з експертом',
        emoji: '🎙️',
        description: 'Провели спільний прямий ефір.',
        category: 'content',
    },
    {
        id: 'three_stories',
        title: '3 сторіс поспіль',
        emoji: '📖',
        description: 'Вели блог 3 дні поспіль без пропусків.',
        category: 'content',
    },
    {
        id: 'first_reels',
        title: 'Перший Reels',
        emoji: '🎬',
        description: 'Опублікували перше коротке експертне відео.',
        category: 'content',
    },
    {
        id: 'reach_1000',
        title: '1000 охоплень',
        emoji: '📊',
        description: 'Отримали перші значні охоплення у рілс/пості/сторіс.',
        category: 'social',
    },
    {
        id: 'reactions_20',
        title: '20 реакцій',
        emoji: '❤️',
        description: 'Зібрали 20 відповідей або реакцій на сторіс.',
        category: 'social',
    },
    {
        id: 'viral_post',
        title: 'Пост-вірус',
        emoji: '💥',
        description: 'Пост набрав у 2 рази більше охоплень, ніж зазвичай.',
        category: 'social',
    },
    {
        id: 'brave_post',
        title: 'Сміливий пост',
        emoji: '🔓',
        description: 'Опублікували відвертий, особистий, сміливий пост.',
        category: 'content',
    },
    {
        id: 'updated_avatar',
        title: 'Оновлений аватар',
        emoji: '✨',
        description: 'Оновили професійну упаковку профілю.',
        category: 'social',
    },
    {
        id: 'warmup_ready',
        title: 'Прогрів готовий',
        emoji: '🔧',
        description: 'Зібрали перший повноцінний прогрів.',
        category: 'content',
    },
    {
        id: 'hashtag_win',
        title: 'Хештег-перемога',
        emoji: '🏷️',
        description: 'Скрін посту в чаті з хештегом «#перемога»',
        category: 'social',
    },
    {
        id: 'live_stream',
        title: 'Прямий ефір',
        emoji: '🌐',
        description: 'Скрін прямого ефіру вашого або експерта.',
        category: 'content',
    },
];
let Achievement = class Achievement {
    title;
    description;
    imageUrl;
    awardedAt;
};
exports.Achievement = Achievement;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Achievement.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Achievement.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Achievement.prototype, "imageUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Achievement.prototype, "awardedAt", void 0);
exports.Achievement = Achievement = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Achievement);
exports.AchievementSchema = mongoose_1.SchemaFactory.createForClass(Achievement);
//# sourceMappingURL=achievement.schema.js.map