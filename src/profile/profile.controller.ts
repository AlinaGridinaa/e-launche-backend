import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfile(@Request() req) {
    return this.profileService.getProfile(String(req.user._id));
  }

  @Put()
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.updateProfile(String(req.user._id), updateProfileDto);
  }

  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `avatar-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return callback(
            new BadRequestException('Тільки зображення дозволені!'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadAvatar(@Request() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Файл не завантажено');
    }

    const avatarUrl = `/api/uploads/avatars/${file.filename}`;
    return this.profileService.updateAvatar(String(req.user._id), avatarUrl);
  }

  @Get('earnings')
  async getEarnings(@Request() req) {
    return this.profileService.getEarnings(String(req.user._id));
  }

  @Post('earnings')
  async addEarning(@Request() req, @Body() addEarningDto: any) {
    return this.profileService.addEarning(String(req.user._id), addEarningDto);
  }

  @Delete('earnings/:id')
  async deleteEarning(@Request() req, @Param('id') earningId: string) {
    return this.profileService.deleteEarning(String(req.user._id), earningId);
  }

  @Get('leaderboard')
  async getLeaderboard(@Request() req) {
    return this.profileService.getLeaderboard(String(req.user._id));
  }
}
