import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SubjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  students: string[];
}
