import { Controller, Get, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CuratorService } from './curator.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('curator')
@UseGuards(JwtAuthGuard)
export class CuratorController {
  constructor(private readonly curatorService: CuratorService) {}

  @Get('homeworks')
  async getHomeworks(@Request() req) {
    const curatorId = req.user._id.toString();
    return this.curatorService.getHomeworksForCurator(curatorId);
  }

  @Put('homeworks/:homeworkId/review')
  async reviewHomework(
    @Request() req,
    @Param('homeworkId') homeworkId: string,
    @Body() reviewDto: { score?: number; feedback?: string },
  ) {
    const curatorId = req.user._id.toString();
    return this.curatorService.reviewHomework(
      curatorId,
      homeworkId,
      reviewDto.score,
      reviewDto.feedback,
    );
  }

  @Put('homeworks/:homeworkId/return')
  async returnForRevision(
    @Request() req,
    @Param('homeworkId') homeworkId: string,
    @Body() returnDto: { feedback: string },
  ) {
    const curatorId = req.user._id.toString();
    return this.curatorService.returnForRevision(
      curatorId,
      homeworkId,
      returnDto.feedback,
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
