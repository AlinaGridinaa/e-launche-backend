import { IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';

export class AddEarningDto {
  @IsNumber()
  amount: number;

  @IsDateString()
  date: string;

  @IsString()
  @IsOptional()
  description?: string;
}
