import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';

import { AuthService } from '../auth/service/auth.service';
import { getContract } from '../utils/gateway';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Roles } from '../auth/guard/roles.decorator';
import { UserType } from '../models/user-type';
import { Subject } from '../models/subject';
import { Grade } from '../models/grade';
import { evaluateTransaction } from '../utils/transaction';

@Controller('student')
export class StudentsController {
  constructor(private enrollService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(UserType.STUDENT)
  @Get('/subjects')
  public async getSubjects(@Request() req): Promise<Subject[]> {
    const contract = await getContract(req.user.username, 'StudentContract', this.enrollService.wallet);
    return await evaluateTransaction<Subject[]>(contract, 'GetSubjects');
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserType.STUDENT)
  @Get('subjects/:subject')
  public async getSubject(@Request() req, @Param('subject') subjectID: string): Promise<Subject> {
    const contract = await getContract(req.user.username, 'StudentContract', this.enrollService.wallet);
    return await evaluateTransaction<Subject>(contract, 'GetSubject', subjectID);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserType.STUDENT)
  @Get('subjects/:subject/grades')
  public async getSubjectGrades(@Request() req, @Param('subject') subjectID: string): Promise<Grade[]> {
    const contract = await getContract(req.user.username, 'StudentContract', this.enrollService.wallet);
    return await evaluateTransaction<Grade[]>(contract, 'GetGrades', subjectID);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserType.STUDENT)
  @Get('subjects/:subject/history')
  public async getSubjectHistory(@Request() req, @Param('subject') subjectID: string): Promise<Subject[]> {
    const contract = await getContract(req.user.username, 'StudentContract', this.enrollService.wallet);
    return await evaluateTransaction<Subject[]>(contract, 'GetSubjectHistory', subjectID);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserType.STUDENT)
  @Get('grades/:grade')
  public async getGrade(@Request() req, @Param('grade') gradeID: string): Promise<Grade> {
    const contract = await getContract(req.user.username, 'StudentContract', this.enrollService.wallet);
    return await evaluateTransaction<Grade>(contract, 'GetGrade', gradeID);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserType.STUDENT)
  @Get('grades/:grade/history')
  public async getGradeHistory(@Request() req, @Param('grade') gradeID: string): Promise<Grade[]> {
    const contract = await getContract(req.user.username, 'StudentContract', this.enrollService.wallet);
    return await evaluateTransaction<Grade[]>(contract, 'GetGradeHistory', gradeID);
  }
}
