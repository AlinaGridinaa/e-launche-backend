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
exports.ScheduleEventSchema = exports.ScheduleEvent = exports.EventType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var EventType;
(function (EventType) {
    EventType["PLATFORM_OPENING"] = "platform_opening";
    EventType["LIVE_STREAM"] = "live_stream";
    EventType["MODULE_OPENING"] = "module_opening";
    EventType["ZOOM_MEETING"] = "zoom_meeting";
    EventType["GROUP_MEETING"] = "group_meeting";
})(EventType || (exports.EventType = EventType = {}));
let ScheduleEvent = class ScheduleEvent {
    title;
    description;
    date;
    time;
    timeEurope;
    type;
    link;
    speaker;
    isCompleted;
    notes;
    tags;
};
exports.ScheduleEvent = ScheduleEvent;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ScheduleEvent.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ScheduleEvent.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], ScheduleEvent.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ScheduleEvent.prototype, "time", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ScheduleEvent.prototype, "timeEurope", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: EventType,
        default: EventType.LIVE_STREAM
    }),
    __metadata("design:type", String)
], ScheduleEvent.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ScheduleEvent.prototype, "link", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ScheduleEvent.prototype, "speaker", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ScheduleEvent.prototype, "isCompleted", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ScheduleEvent.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], ScheduleEvent.prototype, "tags", void 0);
exports.ScheduleEvent = ScheduleEvent = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ScheduleEvent);
exports.ScheduleEventSchema = mongoose_1.SchemaFactory.createForClass(ScheduleEvent);
//# sourceMappingURL=schedule-event.schema.js.map