import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { getContract } from '../utils/gateway';
import { AuthService } from '../auth/service/auth.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Roles } from '../auth/guard/roles.decorator';
import { UserType } from '../models/user-type';
import { SubjectDto } from '../models/subject.dto';
import { GradeDto } from '../models/grade.dto';
import { Subject } from '../models/subject';
import { Grade } from '../models/grade';

@Controller('teachers')
export class TeachersController {
  constructor(private enrollService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(UserType.TEACHER)
  @Get('/subjects')
  public async getSubjects(@Request() req): Promise<Subject[]> {
    const contract = await getContract(req.user.username, 'TeacherContract', this.enrollService.wallet);
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
  @Roles(UserType.TEACHER)
  @Post('/subjects')
  public async createSubject(@Request() req, @Body() subjectDto: SubjectDto): Promise<Subject> {
    const contract = await getContract(req.user.username, 'TeacherContract', this.enrollService.wallet);
    if (!contract) return;

    try {
      const result = await contract.submitTransaction(
        'CreateSubject',
        subjectDto.name,
        subjectDto.description ? subjectDto.description : '',
        JSON.stringify(subjectDto.students),
      );
      return JSON.parse(result.toString());
    } catch (error) {
      console.error(error.message);
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
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
    if (!contract) return;

    try {
      const result = await contract.submitTransaction(
        'UpdateSubject',
        subjectID,
        subjectDto.name,
        subjectDto.description ? subjectDto.description : '',
        JSON.stringify(subjectDto.students),
      );
      return JSON.parse(result.toString());
    } catch (error) {
      console.error(error.message);
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserType.TEACHER)
  @Get('/subjects/:subject/grades')
  public async getSubjectGrades(@Request() req, @Param('subject') subjectID: string): Promise<Grade[]> {
    const contract = await getContract(req.user.username, 'TeacherContract', this.enrollService.wallet);
    if (!contract) return;

    try {
      const result = await contract.evaluateTransaction('GetSubjectGrades', subjectID);
      return JSON.parse(result.toString());
    } catch (error) {
      console.error(error.message);
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
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
    if (!contract) return;

    try {
      const result = await contract.submitTransaction(
        'CreateGrade',
        subjectID,
        gradeDto.studentName,
        gradeDto.grade,
        gradeDto.description,
      );
      return JSON.parse(result.toString());
    } catch (error) {
      console.error(error.message);
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
