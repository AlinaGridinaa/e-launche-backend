import { Controller, Get, Put, Body, Param, UseGuards, Request, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CuratorService } from './curator.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { multerConfig } from '../config/multer.config';

@Controller('curator')
@UseGuards(JwtAuthGuard)
export class CuratorController {
  constructor(private readonly curatorService: CuratorService) {}

  @Get('homeworks')
  async getHomeworks(@Request() req) {
    const curatorId = req.user._id.toString();
    return this.curatorService.getHomeworksForCurator(curatorId);
  }

  @Post('homeworks/upload-audio')
  @UseInterceptors(FileInterceptor('audio', multerConfig))
  async uploadAudio(@UploadedFile() file: Express.Multer.File) {
    if (!file || !file.buffer) {
      throw new Error('Файл не завантажено');
    }
    return this.curatorService.uploadAudioFeedback(file.buffer);
  }

  @Put('homeworks/:homeworkId/review')
  async reviewHomework(
    @Request() req,
    @Param('homeworkId') homeworkId: string,
    @Body() reviewDto: { score?: number; feedback?: string; audioFeedback?: string },
  ) {
    const curatorId = req.user._id.toString();
    return this.curatorService.reviewHomework(
      curatorId,
      homeworkId,
      reviewDto.score,
      reviewDto.feedback,
      reviewDto.audioFeedback,
    );
  }

  @Put('homeworks/:homeworkId/return')
  async returnForRevision(
    @Request() req,
    @Param('homeworkId') homeworkId: string,
    @Body() returnDto: { feedback: string; audioFeedback?: string },
  ) {
    const curatorId = req.user._id.toString();
    return this.curatorService.returnForRevision(
      curatorId,
      homeworkId,
      returnDto.feedback,
      returnDto.audioFeedback,
    );
  }

  @Get('students')
  async getMyStudents(@Request() req) {
    const curatorId = req.user._id.toString();
    return this.curatorService.getMyStudents(curatorId);
  }

  @Get('modules')
  async getAllModules() {
    return this.curatorService.getAllModules();
  }
}
