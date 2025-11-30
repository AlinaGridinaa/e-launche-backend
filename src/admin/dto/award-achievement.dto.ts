import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class AwardAchievementDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  imageUrl: string;
}
