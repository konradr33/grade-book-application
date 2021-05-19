import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { getContract } from '../utils/gateway';
import { AuthService } from '../auth/service/auth.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Roles } from '../auth/guard/roles.decorator';
import { UserType } from '../models/user-type';
import { SubjectDto } from '../models/subject.dto';
import { GradeDto } from '../models/grade.dto';
import { Subject } from '../models/subject';
import { Grade } from '../models/grade';
import { evaluateTransaction, submitTransaction } from '../utils/transaction';

@Controller('teachers')
export class TeachersController {
  constructor(private enrollService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(UserType.TEACHER)
  @Get('/subjects')
  public async getSubjects(@Request() req): Promise<Subject[]> {
    const contract = await getContract(req.user.username, 'TeacherContract', this.enrollService.wallet);
    return await evaluateTransaction<Subject[]>(contract, 'GetSubjects');
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserType.TEACHER)
  @Post('/subjects')
  public async createSubject(@Request() req, @Body() subjectDto: SubjectDto): Promise<Subject> {
    const contract = await getContract(req.user.username, 'TeacherContract', this.enrollService.wallet);
    return await submitTransaction<Subject>(
      contract,
      'CreateSubject',
      subjectDto.name,
      subjectDto.description ? subjectDto.description : '',
      JSON.stringify(subjectDto.students),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserType.TEACHER)
  @Get('/subjects/:subject')
  public async getSubject(@Request() req, @Param('subject') subjectID: string): Promise<Subject> {
    const contract = await getContract(req.user.username, 'TeacherContract', this.enrollService.wallet);
    return await evaluateTransaction<Subject>(contract, 'GetSubject', subjectID);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserType.TEACHER)
  @Put('/subjects/:subject')
  public async updateSubject(
    @Request() req,
    @Param('subject') subjectID: string,
    @Body() subjectDto: SubjectDto,
  ): Promise<Subject> {
    const contract = await getContract(req.user.username, 'TeacherContract', this.enrollService.wallet);
    return await submitTransaction<Subject>(
      contract,
      'UpdateSubject',
      subjectID,
      subjectDto.name,
      subjectDto.description ? subjectDto.description : '',
      JSON.stringify(subjectDto.students),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserType.TEACHER)
  @Delete('/subjects/:subject')
  public async deleteSubject(@Request() req, @Param('subject') subjectID: string): Promise<boolean> {
    const contract = await getContract(req.user.username, 'TeacherContract', this.enrollService.wallet);
    return await submitTransaction<boolean>(contract, 'DeleteSubject', subjectID);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserType.TEACHER)
  @Get('/subjects/:subject/grades')
  public async getSubjectGrades(@Request() req, @Param('subject') subjectID: string): Promise<Grade[]> {
    const contract = await getContract(req.user.username, 'TeacherContract', this.enrollService.wallet);
    return await evaluateTransaction<Grade[]>(contract, 'GetSubjectGrades', subjectID);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserType.TEACHER)
  @Get('/subjects/:subject/history')
  public async getSubjectHistory(@Request() req, @Param('subject') subjectID: string): Promise<Subject> {
    const contract = await getContract(req.user.username, 'TeacherContract', this.enrollService.wallet);
    return await evaluateTransaction<Subject>(contract, 'GetSubjectHistory', subjectID);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserType.TEACHER)
  @Post('/subjects/:subject/grades')
  public async createGrade(
    @Request() req,
    @Param('subject') subjectID: string,
    @Body() gradeDto: GradeDto,
  ): Promise<Grade> {
    const contract = await getContract(req.user.username, 'TeacherContract', this.enrollService.wallet);
    return await submitTransaction<Grade>(
      contract,
      'CreateGrade',
      subjectID,
      gradeDto.studentName,
      gradeDto.grade,
      gradeDto.description,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserType.TEACHER)
  @Get('/grades/:grade')
  public async getGrade(@Request() req, @Param('grade') gradeID: string): Promise<Grade> {
    const contract = await getContract(req.user.username, 'TeacherContract', this.enrollService.wallet);
    return await evaluateTransaction<Grade>(contract, 'GetGrade', gradeID);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserType.TEACHER)
  @Put('/grades/:grade')
  public async updateGrade(
    @Request() req,
    @Param('grade') gradeID: string,
    @Body() gradeDto: Partial<GradeDto>,
  ): Promise<Grade> {
    const contract = await getContract(req.user.username, 'TeacherContract', this.enrollService.wallet);
    return await submitTransaction<Grade>(contract, 'UpdateGrade', gradeID, gradeDto.grade, gradeDto.description);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserType.TEACHER)
  @Delete('/grades/:grade')
  public async deleteGrade(@Request() req, @Param('grade') gradeID: string): Promise<boolean> {
    const contract = await getContract(req.user.username, 'TeacherContract', this.enrollService.wallet);
    return await submitTransaction<boolean>(contract, 'DeleteGrade', gradeID);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserType.TEACHER)
  @Get('/grades/:grade/history')
  public async getGradeHistory(@Request() req, @Param('grade') gradeID: string): Promise<Grade[]> {
    const contract = await getContract(req.user.username, 'TeacherContract', this.enrollService.wallet);
    return await evaluateTransaction<Grade[]>(contract, 'GetGradeHistory', gradeID);
  }
}
