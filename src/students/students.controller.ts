import { Controller, Get, HttpException, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';

import { EnrollService } from '../auth/enroll/enroll.service';
import { WalletAuthGuard } from '../auth/passport/wallet-auth.guard';
import { getContract } from '../utils/gateway';

@Controller('student')
export class StudentsController {
  constructor(private enrollService: EnrollService) {}

  @UseGuards(WalletAuthGuard)
  @Get('/subjects')
  public async getSubjects(@Query('username') username: string) {
    const contract = await getContract(username, 'StudentContract', this.enrollService.wallet);
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
  @Get('subject/:subject')
  public async getSubjectGrades(@Param('subject') subject: string, @Query('username') username: string) {
    const contract = await getContract(username, 'StudentContract', this.enrollService.wallet);
    if (!contract) return;

    try {
      const result = await contract.evaluateTransaction('GetGrades', subject);
      return JSON.parse(result.toString());
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
