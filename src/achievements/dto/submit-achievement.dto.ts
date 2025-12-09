import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class SubmitAchievementDto {
  @IsString()
  @IsNotEmpty()
  achievementId: string;

  @IsString()
  @IsOptional()
  proofText?: string;

  @IsString()
  @IsOptional()
  proofFile?: string;

  @IsString()
  @IsOptional()
  proofLink?: string;
}
