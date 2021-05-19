import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateGradeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  grade: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;
}
