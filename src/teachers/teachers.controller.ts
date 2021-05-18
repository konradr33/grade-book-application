import { Controller, Get, HttpException, HttpStatus, Param, Post, Request, UseGuards } from '@nestjs/common';
import { getContract } from '../utils/gateway';
import { AuthService } from '../auth/service/auth.service';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { Roles } from '../auth/passport/roles.decorator';
import { UserType } from '../models/user-type';

@Controller('teachers')
export class TeachersController {
  constructor(private enrollService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(UserType.TEACHER)
  @Get('/subjects')
  public async getSubjects(@Request() req) {
    const contract = await getContract(req.user.username, 'TeacherContract', this.enrollService.wallet);
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
  @Roles(UserType.TEACHER)
  @Post('/subjects')
  public async createSubject(@Request() req) {
    const contract = await getContract(req.user.username, 'TeacherContract', this.enrollService.wallet);
    if (!contract) return;

    try {
      const students = new Array(1);
      students[0] = 'user1';
      console.log(JSON.stringify(students));
      const result = await contract.submitTransaction(
        'CreateSubject',
        'name1',
        'description1',
        JSON.stringify(students),
      );
      return JSON.parse(result.toString());
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserType.TEACHER)
  @Get('/subjects/:subject')
  public async getSubjectGrades(@Request() req, @Param('subject') subjectID: string) {
    const contract = await getContract(req.user.username, 'TeacherContract', this.enrollService.wallet);
    if (!contract) return;

    try {
      const result = await contract.evaluateTransaction('GetSubjectGrades', subjectID);
      return JSON.parse(result.toString());
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserType.TEACHER)
  @Post('/subjects/:subject')
  public async createGrade(@Request() req, @Param('subject') subjectID: string) {
    const contract = await getContract(req.user.username, 'TeacherContract', this.enrollService.wallet);
    if (!contract) return;

    try {
      const result = await contract.submitTransaction('CreateGrade', subjectID, 'user1', '+3', 'reason');
      return JSON.parse(result.toString());
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
