import { IsNotEmpty, IsString } from 'class-validator';

export class GradeDto {
  @IsString()
  @IsNotEmpty()
  studentName: string;

  @IsString()
  @IsNotEmpty()
  grade: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
