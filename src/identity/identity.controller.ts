import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Request, UseGuards } from '@nestjs/common';
import { UserData } from '../models/user-data';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { getContract } from '../utils/gateway';
import { evaluateTransaction, submitTransaction } from '../utils/transaction';

import { AuthService } from '../auth/service/auth.service';
import { Roles } from '../auth/guard/roles.decorator';
import { UserRole } from '../models/user-role';
import { UserDataDto } from '../models/user-data.dto';

@Controller('identity')
export class IdentityController {
  constructor(private enrollService: AuthService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @Post(':username')
  public async setUserData(
    @Request() req,
    @Param('username') username: string,
    @Body() subjectDto: UserDataDto,
  ): Promise<void> {
    const contract = await getContract(req.user.username, 'IdentityContract', this.enrollService.wallet);
    const transientData = Buffer.from(JSON.stringify(subjectDto));

    try {
      await contract
        .createTransaction('SetIdentityDetails')
        .setTransient({
          asset_properties: transientData,
        })
        .submit(username);
      return;
    } catch (error) {
      console.error(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.TEACHER)
  @Get('students')
  public async getStudentList(@Request() req): Promise<UserData> {
    const contract = await getContract(req.user.username, 'IdentityContract', this.enrollService.wallet);
    return await submitTransaction<UserData>(contract, 'GetStudentsList');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  @Get(':username')
  public async getUserData(@Request() req, @Param('username') username: string): Promise<UserDataDto> {
    const contract = await getContract(req.user.username, 'IdentityContract', this.enrollService.wallet);
    return await evaluateTransaction<UserData>(contract, 'GetIdentityDetails', username);
  }
}
