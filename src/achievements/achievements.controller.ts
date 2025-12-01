import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AchievementsService, SubmitAchievementDto } from './achievements.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('achievements')
@UseGuards(JwtAuthGuard)
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

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

  // Відправити заявку на нагороду
  @Post('submit')
  async submitAchievement(@Request() req, @Body() dto: SubmitAchievementDto) {
    const userId = req.user.sub;
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
