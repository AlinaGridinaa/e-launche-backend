import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { ScheduleEvent, ScheduleEventSchema } from '../schemas/schedule-event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ScheduleEvent.name, schema: ScheduleEventSchema },
    ]),
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class ScheduleModule {}
