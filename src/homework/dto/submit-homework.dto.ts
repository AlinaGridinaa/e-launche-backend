import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class SubmitHomeworkDto {
  @IsString()
  @IsNotEmpty()
  moduleId: string;

  @IsNotEmpty()
  lessonNumber: number;

  @IsString()
  @IsNotEmpty()
  answer: string;

  @IsArray()
  @IsOptional()
  attachments?: string[];
}
