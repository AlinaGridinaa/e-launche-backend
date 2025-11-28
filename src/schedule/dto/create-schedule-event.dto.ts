import { IsString, IsOptional, IsDateString, IsEnum, IsBoolean, IsArray } from 'class-validator';
import { EventType } from '../../schemas/schedule-event.schema';

export class CreateScheduleEventDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  time?: string;

  @IsOptional()
  @IsString()
  timeEurope?: string;

  @IsOptional()
  @IsEnum(EventType)
  type?: EventType;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  speaker?: string;

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
