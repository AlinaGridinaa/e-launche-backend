import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { CuratorController } from './curator.controller';
import { CuratorService } from './curator.service';
import { Homework, HomeworkSchema } from '../schemas/homework.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { Module as ModuleEntity, ModuleSchema } from '../schemas/module.schema';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Homework.name, schema: HomeworkSchema },
      { name: User.name, schema: UserSchema },
      { name: ModuleEntity.name, schema: ModuleSchema },
    ]),
    MulterModule.register({
      dest: './uploads/audio-feedback',
    }),
    NotificationsModule,
  ],
  controllers: [CuratorController],
  providers: [CuratorService],
})
export class CuratorModule {}
