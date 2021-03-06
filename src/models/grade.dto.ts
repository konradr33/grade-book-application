import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GradeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  studentName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  grade: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;
}
