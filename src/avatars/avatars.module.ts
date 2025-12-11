import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AvatarsController } from './avatars.controller';
import { AvatarLevel, AvatarLevelSchema } from '../schemas/avatar-level.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AvatarLevel.name, schema: AvatarLevelSchema },
    ]),
  ],
  controllers: [AvatarsController],
})
export class AvatarsModule {}
