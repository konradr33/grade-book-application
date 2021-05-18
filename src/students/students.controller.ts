import { Controller, Get, HttpException, HttpStatus, Param, Request, UseGuards } from '@nestjs/common';

import { AuthService } from '../auth/service/auth.service';
import { getContract } from '../utils/gateway';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { Roles } from '../auth/passport/roles.decorator';
import { UserType } from '../models/user-type';

@Controller('student')
export class StudentsController {
  constructor(private enrollService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(UserType.STUDENT)
  @Get('/subjects')
  public async getSubjects(@Request() req) {
    const contract = await getContract(req.user.username, 'StudentContract', this.enrollService.wallet);
    if (!contract) return;

    try {
      const result = await contract.evaluateTransaction('GetSubjects');
      return JSON.parse(result.toString());
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserType.STUDENT)
  @Get('subject/:subject')
  public async getSubjectGrades(@Request() req, @Param('subject') subjectID: string) {
    const contract = await getContract(req.user.username, 'StudentContract', this.enrollService.wallet);
    if (!contract) return;

    try {
      const result = await contract.evaluateTransaction('GetGrades', subjectID);
      return JSON.parse(result.toString());
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
