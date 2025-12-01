import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ModulesService } from './modules.service';
import { Module } from '../schemas/module.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('modules')
@UseGuards(JwtAuthGuard)
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Get()
  async findAll(@Req() request: Request & { user: any }): Promise<Module[]> {
    const userId = request.user._id.toString();
    return this.modulesService.findAllWithUserProgress(userId);
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
    @Req() request: Request & { user: any },
  ): Promise<Module | null> {
    const userId = request.user._id.toString();
    return this.modulesService.findByIdWithUserProgress(id, userId);
  }

  @Get('number/:number')
  async findByNumber(@Param('number') number: string): Promise<Module | null> {
    return this.modulesService.findByNumber(parseInt(number, 10));
  }

  @Post()
  async create(@Body() moduleData: Partial<Module>): Promise<Module> {
    return this.modulesService.create(moduleData);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() moduleData: Partial<Module>,
  ): Promise<Module | null> {
    return this.modulesService.update(id, moduleData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Module | null> {
    return this.modulesService.delete(id);
  }

  @Put(':id/lessons/:lessonNumber/complete')
  async markLessonComplete(
    @Param('id') id: string,
    @Param('lessonNumber') lessonNumber: string,
    @Body('isCompleted') isCompleted: boolean,
  ): Promise<Module> {
    return this.modulesService.updateLessonCompletion(
      id,
      parseInt(lessonNumber, 10),
      isCompleted,
    );
  }
}
