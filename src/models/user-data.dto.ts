import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from './user-role';

export class UserDataDto {
  @ApiProperty()
  @IsEnum(UserRole)
  @IsNotEmpty()
  public role: UserRole;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public surname: string;
}
