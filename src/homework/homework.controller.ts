import { Controller, Post, Get, Body, UseGuards, Req, Param, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HomeworkService } from './homework.service';
import { SubmitHomeworkDto } from './dto/submit-homework.dto';

@Controller('homework')
@UseGuards(JwtAuthGuard)
export class HomeworkController {
  constructor(private readonly homeworkService: HomeworkService) {}

  @Post('submit')
  async submitHomework(@Req() req, @Body() dto: SubmitHomeworkDto) {
    const userId = req.user._id.toString();
    return this.homeworkService.submitHomework(userId, dto);
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
