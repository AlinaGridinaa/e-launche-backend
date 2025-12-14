import { Controller, Post, Get, Req, Param, ParseIntPipe, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HomeworkService } from './homework.service';
import { homeworkFilesConfig } from '../config/multer.config';

@Controller('homework')
@UseGuards(JwtAuthGuard)
export class HomeworkController {
  constructor(private readonly homeworkService: HomeworkService) {}

  @Post('submit')
  @UseInterceptors(FilesInterceptor('files', 5, homeworkFilesConfig))
  async submitHomework(
    @Req() req,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const userId = req.user._id.toString();
    // Отримуємо дані з body (не можна використовувати @Body() з FormData)
    const dto = {
      moduleId: req.body.moduleId,
      lessonNumber: req.body.lessonNumber,
      answer: req.body.answer,
      attachments: req.body.attachments,
    };
    return this.homeworkService.submitHomework(userId, dto, files);
  }

  @Get('my/:moduleId/:lessonNumber')
  async getMyHomework(
    @Req() req,
    @Param('moduleId') moduleId: string,
    @Param('lessonNumber', ParseIntPipe) lessonNumber: number,
  ) {
    const userId = req.user._id.toString();
    return this.homeworkService.getMyHomework(userId, moduleId, lessonNumber);
  }

  @Get('my')
  async getMyAllHomeworks(@Req() req) {
    const userId = req.user._id.toString();
    return this.homeworkService.getMyAllHomeworks(userId);
  }
}
