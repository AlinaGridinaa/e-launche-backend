import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProgressService } from './progress.service';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post('lessons/:moduleId/:lessonNumber/complete')
  async completeLesson(
    @Request() req,
    @Param('moduleId') moduleId: string,
    @Param('lessonNumber') lessonNumber: string,
  ) {
    return this.progressService.completeLesson(
      String(req.user._id),
      moduleId,
      parseInt(lessonNumber),
    );
  }

  @Delete('lessons/:moduleId/:lessonNumber/complete')
  async uncompleteLesson(
    @Request() req,
    @Param('moduleId') moduleId: string,
    @Param('lessonNumber') lessonNumber: string,
  ) {
    return this.progressService.uncompleteLesson(
      String(req.user._id),
      moduleId,
      parseInt(lessonNumber),
    );
  }

  @Post('modules/:moduleId/complete')
  async completeModule(
    @Request() req,
    @Param('moduleId') moduleId: string,
  ) {
    return this.progressService.completeModule(
      String(req.user._id),
      moduleId,
    );
  }

  @Get('lessons/:moduleId/:lessonNumber/status')
  async getLessonStatus(
    @Request() req,
    @Param('moduleId') moduleId: string,
    @Param('lessonNumber') lessonNumber: string,
  ) {
    const isCompleted = await this.progressService.isLessonCompleted(
      String(req.user._id),
      moduleId,
      parseInt(lessonNumber),
    );
    return { isCompleted };
  }
}
