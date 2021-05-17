import { Controller, Get, HttpException, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { WalletAuthGuard } from '../auth/passport/wallet-auth.guard';
import { getContract } from '../utils/gateway';
import { EnrollService } from '../auth/enroll/enroll.service';

@Controller('teachers')
export class TeachersController {
  constructor(private enrollService: EnrollService) {}

  @UseGuards(WalletAuthGuard)
  @Post('/subjects')
  public async createSubject(@Query('username') username: string) {
    const contract = await getContract(username, 'TeacherContract', this.enrollService.wallet);
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

  @UseGuards(WalletAuthGuard)
  @Get('/subjects')
  public async getSubjects(@Query('username') username: string) {
    const contract = await getContract(username, 'TeacherContract', this.enrollService.wallet);
    if (!contract) return;

    try {
      const result = await contract.evaluateTransaction('GetSubjects');
      return JSON.parse(result.toString());
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @UseGuards(WalletAuthGuard)
  @Get('/subjects/:subject')
  public async getSubjectGrades(@Param('subject') subjectID: string, @Query('username') username: string) {
    const contract = await getContract(username, 'TeacherContract', this.enrollService.wallet);
    if (!contract) return;

    try {
      const result = await contract.evaluateTransaction('GetSubjectGrades', subjectID);
      return JSON.parse(result.toString());
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @UseGuards(WalletAuthGuard)
  @Post('/subjects/:subject')
  public async createGrade(@Param('subject') subjectID: string, @Query('username') username: string) {
    const contract = await getContract(username, 'TeacherContract', this.enrollService.wallet);
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
