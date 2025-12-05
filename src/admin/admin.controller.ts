import { Controller, Get, Put, Post, Patch, Delete, Body, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AssignFacultyDto } from './dto/assign-faculty.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { AwardAchievementDto } from './dto/award-achievement.dto';
import { avatarStorage, imageFileFilter } from '../config/multer.config';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Post('users')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.adminService.createUser(createUserDto);
  }

  @Patch('users/:userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: Partial<CreateUserDto>,
  ) {
    return this.adminService.updateUser(userId, updateUserDto);
  }

  @Patch('users/:userId/password')
  async changePassword(
    @Param('userId') userId: string,
    @Body('password') password: string,
  ) {
    return this.adminService.changePassword(userId, password);
  }

  @Delete('users/:userId')
  async deleteUser(@Param('userId') userId: string) {
    return this.adminService.deleteUser(userId);
  }

  @Put('users/:userId/faculty')
  async assignFaculty(
    @Param('userId') userId: string,
    @Body() assignFacultyDto: AssignFacultyDto,
  ) {
    return this.adminService.assignFaculty(userId, assignFacultyDto.faculty);
  }

  @Put('users/:userId/admin')
  async toggleAdmin(@Param('userId') userId: string) {
    return this.adminService.toggleAdmin(userId);
  }

  @Get('stats')
  async getStats() {
    return this.adminService.getStats();
  }

  @Post('users/:userId/achievements')
  async awardAchievement(
    @Param('userId') userId: string,
    @Body() achievementDto: AwardAchievementDto,
  ) {
    return this.adminService.awardAchievement(userId, achievementDto);
  }

  @Get('users/:userId/achievements')
  async getUserAchievements(@Param('userId') userId: string) {
    return this.adminService.getUserAchievements(userId);
  }

  @Delete('users/:userId/achievements/:achievementId')
  async removeAchievement(
    @Param('userId') userId: string,
    @Param('achievementId') achievementId: string,
  ) {
    return this.adminService.removeAchievement(userId, achievementId);
  }

  @Put('users/:userId/curator-toggle')
  async toggleCurator(@Param('userId') userId: string) {
    return this.adminService.toggleCurator(userId);
  }

  @Put('users/:userId/assign-curator')
  async assignCurator(
    @Param('userId') userId: string,
    @Body() body: { curatorId: string },
  ) {
    return this.adminService.assignCurator(userId, body.curatorId);
  }

  @Get('curators')
  async getAllCurators() {
    return this.adminService.getAllCurators();
  }

  // ===== MODULES ENDPOINTS =====

  @Get('modules')
  async getAllModules() {
    return this.adminService.getAllModules();
  }

  @Get('modules/:moduleId')
  async getModuleById(@Param('moduleId') moduleId: string) {
    return this.adminService.getModuleById(moduleId);
  }

  @Post('modules')
  async createModule(@Body() moduleData: {
    number: number;
    title: string;
    description?: string;
    category?: string;
    isLocked?: boolean;
    unlockDate?: Date;
  }) {
    return this.adminService.createModule(moduleData);
  }

  @Put('modules/:moduleId')
  async updateModule(
    @Param('moduleId') moduleId: string,
    @Body() updateData: {
      number?: number;
      title?: string;
      description?: string;
      category?: string;
      isLocked?: boolean;
      unlockDate?: Date;
    }
  ) {
    return this.adminService.updateModule(moduleId, updateData);
  }

  @Delete('modules/:moduleId')
  async deleteModule(@Param('moduleId') moduleId: string) {
    return this.adminService.deleteModule(moduleId);
  }

  @Put('modules/:moduleId/toggle-lock')
  async toggleModuleLock(@Param('moduleId') moduleId: string) {
    return this.adminService.toggleModuleLock(moduleId);
  }

  // ===== LESSONS ENDPOINTS =====

  @Post('modules/:moduleId/lessons')
  async createLesson(
    @Param('moduleId') moduleId: string,
    @Body() lessonData: {
      number: number;
      title: string;
      description?: string;
      videoUrl?: string;
      homework?: string;
      duration?: number;
    }
  ) {
    return this.adminService.createLesson(moduleId, lessonData);
  }

  @Put('modules/:moduleId/lessons/:lessonNumber')
  async updateLesson(
    @Param('moduleId') moduleId: string,
    @Param('lessonNumber') lessonNumber: number,
    @Body() updateData: {
      title?: string;
      description?: string;
      videoUrl?: string;
      homework?: string;
      duration?: number;
    }
  ) {
    return this.adminService.updateLesson(moduleId, +lessonNumber, updateData);
  }

  @Delete('modules/:moduleId/lessons/:lessonNumber')
  async deleteLesson(
    @Param('moduleId') moduleId: string,
    @Param('lessonNumber') lessonNumber: number,
  ) {
    return this.adminService.deleteLesson(moduleId, +lessonNumber);
  }

  @Post('modules/:moduleId/lessons/:lessonNumber/materials')
  async addLessonMaterial(
    @Param('moduleId') moduleId: string,
    @Param('lessonNumber') lessonNumber: number,
    @Body() materialData: {
      type: string;
      title: string;
      url: string;
    }
  ) {
    return this.adminService.addLessonMaterial(moduleId, +lessonNumber, materialData);
  }

  @Delete('modules/:moduleId/lessons/:lessonNumber/materials/:materialIndex')
  async deleteLessonMaterial(
    @Param('moduleId') moduleId: string,
    @Param('lessonNumber') lessonNumber: number,
    @Param('materialIndex') materialIndex: number,
  ) {
    return this.adminService.deleteLessonMaterial(moduleId, +lessonNumber, +materialIndex);
  }

  // ===== AVATAR LEVELS ENDPOINTS =====

  @Get('avatars')
  async getAllAvatarLevels() {
    return this.adminService.getAllAvatarLevels();
  }

  @Get('avatars/:level')
  async getAvatarLevel(@Param('level') level: number) {
    return this.adminService.getAvatarLevel(+level);
  }

  @Put('avatars/:level')
  async setAvatarLevel(
    @Param('level') level: number,
    @Body() body: { imageUrl: string; description?: string },
  ) {
    return this.adminService.setAvatarLevel(+level, body.imageUrl, body.description);
  }

  @Delete('avatars/:level')
  async deleteAvatarLevel(@Param('level') level: number) {
    return this.adminService.deleteAvatarLevel(+level);
  }

  @Post('avatars/initialize')
  async initializeDefaultAvatars() {
    return this.adminService.initializeDefaultAvatars();
  }

  @Post('avatars/:level/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: avatarStorage,
      fileFilter: imageFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async uploadAvatarImage(
    @Param('level') level: number,
    @UploadedFile() file: Express.Multer.File,
    @Body('description') description?: string,
  ) {
    if (!file) {
      throw new Error('Файл не завантажено');
    }

    // Завантажуємо на Cloudinary і отримуємо URL
    const imageUrl = await this.adminService.uploadAvatarToCloudinary(file.path);
    
    // Видаляємо локальний файл після завантаження
    const fs = require('fs');
    fs.unlinkSync(file.path);
    
    return this.adminService.setAvatarLevel(+level, imageUrl, description);
  }

  @Get('lesson-ratings')
  async getLessonRatings(@Param('moduleId') moduleId?: string) {
    return this.adminService.getLessonRatingsStatistics(moduleId);
  }

  @Post('send-notification')
  async sendCustomNotification(
    @Body() body: {
      title: string;
      message: string;
      url?: string;
      sendToAll: boolean;
      userIds?: string[];
    }
  ) {
    return this.adminService.sendCustomNotification(
      body.title,
      body.message,
      body.url,
      body.sendToAll,
      body.userIds
    );
  }
}
