import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AchievementsService } from './achievements.service';
import { SubmitAchievementDto } from './dto/submit-achievement.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';

@Controller('achievements')
@UseGuards(JwtAuthGuard)
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {
    // Налаштування Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  // Отримати всі типи нагород
  @Get('types')
  async getAllTypes() {
    const types = this.achievementsService.getAllAchievementTypes();
    return {
      success: true,
      data: types,
    };
  }

  // Отримати нагороди поточного користувача
  @Get('my')
  async getMyAchievements(@Request() req) {
    const userId = req.user.sub;
    const achievements = await this.achievementsService.getUserAchievements(userId);
    return {
      success: true,
      data: achievements,
    };
  }

  // Завантажити файл підтвердження
  @Post('upload-proof')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/achievements',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `proof-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|pdf)$/)) {
          return callback(
            new BadRequestException('Тільки зображення та PDF дозволені!'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async uploadProof(@Request() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Файл не завантажено');
    }

    try {
      // Завантажуємо на Cloudinary
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'hogwarts/achievements',
        resource_type: 'auto',
      });

      // Видаляємо локальний файл після завантаження
      fs.unlinkSync(file.path);

      return {
        success: true,
        fileUrl: result.secure_url,
        message: 'Файл успішно завантажено',
      };
    } catch (error) {
      console.error('Upload error:', error);
      // Видаляємо файл навіть якщо завантаження не вдалося
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw new BadRequestException('Помилка завантаження файлу на Cloudinary');
    }
  }

  // Відправити заявку на нагороду
  @Post('submit')
  async submitAchievement(@Request() req, @Body() dto: SubmitAchievementDto) {
    const userId = req.user._id || req.user.sub;
    const achievement = await this.achievementsService.submitAchievement(userId, dto);
    return {
      success: true,
      data: achievement,
      message: 'Заявку відправлено на розгляд',
    };
  }

  // Отримати всі заявки (для кураторів)
  @Get('pending')
  async getPendingAchievements(@Request() req) {
    // Перевірка, чи користувач - куратор або адмін
    if (!req.user.isCurator && !req.user.isAdmin) {
      return {
        success: false,
        message: 'Доступ заборонено',
      };
    }

    const achievements = await this.achievementsService.getAllPendingAchievements();
    return {
      success: true,
      data: achievements,
    };
  }

  // Схвалити нагороду (для кураторів)
  @Put(':id/approve')
  async approveAchievement(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { comment?: string },
  ) {
    if (!req.user.isCurator && !req.user.isAdmin) {
      return {
        success: false,
        message: 'Доступ заборонено',
      };
    }

    const achievement = await this.achievementsService.approveAchievement(id, body.comment);
    return {
      success: true,
      data: achievement,
      message: 'Нагороду схвалено',
    };
  }

  // Відхилити нагороду (для кураторів)
  @Put(':id/reject')
  async rejectAchievement(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { comment: string },
  ) {
    if (!req.user.isCurator && !req.user.isAdmin) {
      return {
        success: false,
        message: 'Доступ заборонено',
      };
    }

    const achievement = await this.achievementsService.rejectAchievement(id, body.comment);
    return {
      success: true,
      data: achievement,
      message: 'Заявку відхилено',
    };
  }
}
