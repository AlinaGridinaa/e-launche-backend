import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleEventDto } from './dto/create-schedule-event.dto';
import { UpdateScheduleEventDto } from './dto/update-schedule-event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  async findAll() {
    const events = await this.scheduleService.findAll();
    return {
      success: true,
      data: events,
    };
  }

  @Get('upcoming')
  async findUpcoming() {
    const events = await this.scheduleService.findUpcoming();
    return {
      success: true,
      data: events,
    };
  }

  @Get('range')
  async findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const events = await this.scheduleService.findByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
    return {
      success: true,
      data: events,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const event = await this.scheduleService.findOne(id);
    return {
      success: true,
      data: event,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateScheduleEventDto) {
    const event = await this.scheduleService.create(createDto);
    return {
      success: true,
      data: event,
      message: 'Подію створено успішно',
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateScheduleEventDto,
  ) {
    const event = await this.scheduleService.update(id, updateDto);
    return {
      success: true,
      data: event,
      message: 'Подію оновлено успішно',
    };
  }

  @Put(':id/complete')
  @UseGuards(JwtAuthGuard)
  async markAsCompleted(@Param('id') id: string) {
    const event = await this.scheduleService.markAsCompleted(id);
    return {
      success: true,
      data: event,
      message: 'Подію відмічено як завершену',
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.scheduleService.remove(id);
  }
}
