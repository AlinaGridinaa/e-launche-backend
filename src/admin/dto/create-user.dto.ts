import { IsEmail, IsString, MinLength, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsOptional()
  phoneOrTelegram?: string; // Номер телефону або телеграм

  @IsString()
  @IsOptional()
  group?: string; // Група студента

  @IsOptional()
  @IsDateString()
  accessUntil?: string; // Доступ до якої дати (ISO string, якщо не вказано - назавжди)

  @IsString()
  @IsOptional()
  tariff?: string; // Тариф: Преміум, ВІП, Легенда

  @IsString()
  @IsOptional()
  faculty?: string;

  @IsString()
  @IsOptional()
  curatorId?: string; // ID куратора

  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;

  @IsBoolean()
  @IsOptional()
  isCurator?: boolean;
}
