import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AvatarLevel, AvatarLevelDocument } from '../schemas/avatar-level.schema';

@Controller('avatars')
@UseGuards(JwtAuthGuard)
export class AvatarsController {
  constructor(
    @InjectModel(AvatarLevel.name) private avatarLevelModel: Model<AvatarLevelDocument>,
  ) {}

  @Get()
  async getAllAvatars() {
    return this.avatarLevelModel.find().sort({ level: 1 }).exec();
  }

  @Get(':level')
  async getAvatarByLevel(@Param('level') level: number) {
    return this.avatarLevelModel.findOne({ level: +level }).exec();
  }
}
