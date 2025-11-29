import { IsString, IsIn } from 'class-validator';

export class AssignFacultyDto {
  @IsString({ message: 'Факультет повинен бути рядком' })
  @IsIn(['Продюсер', 'Експерт', 'Досвідчений'], {
    message: 'Факультет має бути одним з: Продюсер, Експерт, Досвідчений',
  })
  faculty: string;
}
