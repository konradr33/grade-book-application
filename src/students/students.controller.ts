import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';

import { AuthService } from '../auth/service/auth.service';
import { getContract } from '../utils/gateway';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Roles } from '../auth/guard/roles.decorator';
import { UserRole } from '../models/user-role';
import { Subject } from '../models/subject';
import { Grade } from '../models/grade';
import { evaluateTransaction } from '../utils/transaction';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('students')
export class StudentsController {
  constructor(private enrollService: AuthService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.STUDENT)
  @Get('/subjects')
  public async getSubjects(@Request() req): Promise<Subject[]> {
    const contract = await getContract(req.user.username, 'StudentContract', this.enrollService.wallet);
    return await evaluateTransaction<Subject[]>(contract, 'GetSubjects');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.STUDENT)
  @Get('subjects/:subject')
  public async getSubject(@Request() req, @Param('subject') subjectID: string): Promise<Subject> {
    const contract = await getContract(req.user.username, 'StudentContract', this.enrollService.wallet);
    return await evaluateTransaction<Subject>(contract, 'GetSubject', subjectID);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.STUDENT)
  @Get('subjects/:subject/grades')
  public async getSubjectGrades(@Request() req, @Param('subject') subjectID: string): Promise<Grade[]> {
    const contract = await getContract(req.user.username, 'StudentContract', this.enrollService.wallet);
    return await evaluateTransaction<Grade[]>(contract, 'GetGrades', subjectID);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.STUDENT)
  @Get('subjects/:subject/history')
  public async getSubjectHistory(@Request() req, @Param('subject') subjectID: string): Promise<Subject[]> {
    const contract = await getContract(req.user.username, 'StudentContract', this.enrollService.wallet);
    return await evaluateTransaction<Subject[]>(contract, 'GetSubjectHistory', subjectID);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.STUDENT)
  @Get('grades/:grade')
  public async getGrade(@Request() req, @Param('grade') gradeID: string): Promise<Grade> {
    const contract = await getContract(req.user.username, 'StudentContract', this.enrollService.wallet);
    return await evaluateTransaction<Grade>(contract, 'GetGrade', gradeID);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.STUDENT)
  @Get('grades/:grade/history')
  public async getGradeHistory(@Request() req, @Param('grade') gradeID: string): Promise<Grade[]> {
    const contract = await getContract(req.user.username, 'StudentContract', this.enrollService.wallet);
    return await evaluateTransaction<Grade[]>(contract, 'GetGradeHistory', gradeID);
  }
}
