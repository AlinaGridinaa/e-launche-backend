import { IsEmail, IsString, MinLength, MaxLength, IsOptional, Matches } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Невірний формат email' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Пароль повинен містити мінімум 6 символів' })
  @MaxLength(50, { message: 'Пароль не може перевищувати 50 символів' })
  password: string;

  @IsString()
  @MinLength(2, { message: "Ім'я повинно містити мінімум 2 символи" })
  @MaxLength(100, { message: "Ім'я не може перевищувати 100 символів" })
  firstName: string;

  @IsString()
  @MinLength(2, { message: 'Прізвище повинно містити мінімум 2 символи' })
  @MaxLength(100, { message: 'Прізвище не може перевищувати 100 символів' })
  lastName: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[\d\s\-()]+$/, { message: 'Невірний формат телефону' })
  phone?: string;
}
