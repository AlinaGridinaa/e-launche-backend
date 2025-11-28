import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DevController } from './dev.controller';
import { User, UserSchema } from '../schemas/user.schema';
import { ScheduleEvent, ScheduleEventSchema } from '../schemas/schedule-event.schema';
import { ModulesModule } from '../modules/modules.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: ScheduleEvent.name, schema: ScheduleEventSchema },
    ]),
    ModulesModule,
  ],
  controllers: [DevController],
})
export class DevModule {}
