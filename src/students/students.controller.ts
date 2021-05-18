import { Controller, Get, HttpException, HttpStatus, Param, Request, UseGuards } from '@nestjs/common';

import { AuthService } from '../auth/service/auth.service';
import { getContract } from '../utils/gateway';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Roles } from '../auth/guard/roles.decorator';
import { UserType } from '../models/user-type';
import { Subject } from '../models/subject';
import { Grade } from '../models/grade';

@Controller('student')
export class StudentsController {
  constructor(private enrollService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(UserType.STUDENT)
  @Get('/subjects')
  public async getSubjects(@Request() req): Promise<Subject[]> {
    const contract = await getContract(req.user.username, 'StudentContract', this.enrollService.wallet);
    if (!contract) return;

    try {
      const result = await contract.evaluateTransaction('GetSubjects');
      return JSON.parse(result.toString());
    } catch (error) {
      console.error(error.message);
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserType.STUDENT)
  @Get('subject/:subject')
  public async getSubjectGrades(@Request() req, @Param('subject') subjectID: string): Promise<Grade[]> {
    const contract = await getContract(req.user.username, 'StudentContract', this.enrollService.wallet);
    if (!contract) return;

    try {
      const result = await contract.evaluateTransaction('GetGrades', subjectID);
      return JSON.parse(result.toString());
    } catch (error) {
      console.error(error.message);
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
