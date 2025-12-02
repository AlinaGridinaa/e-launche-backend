import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User, UserSchema } from '../schemas/user.schema';
import { Module as ModuleEntity, ModuleSchema } from '../schemas/module.schema';
import { AvatarLevel, AvatarLevelSchema } from '../schemas/avatar-level.schema';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: ModuleEntity.name, schema: ModuleSchema },
      { name: AvatarLevel.name, schema: AvatarLevelSchema },
    ]),
    NotificationsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
