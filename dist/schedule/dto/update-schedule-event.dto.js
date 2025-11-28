"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateScheduleEventDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_schedule_event_dto_1 = require("./create-schedule-event.dto");
class UpdateScheduleEventDto extends (0, mapped_types_1.PartialType)(create_schedule_event_dto_1.CreateScheduleEventDto) {
}
exports.UpdateScheduleEventDto = UpdateScheduleEventDto;
//# sourceMappingURL=update-schedule-event.dto.js.map