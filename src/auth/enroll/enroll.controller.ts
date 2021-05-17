import { Controller, Get, Query } from '@nestjs/common';

import { EnrollService } from './enroll.service';

@Controller()
export class EnrollController {
  constructor(private enrollService: EnrollService) {}

  @Get('enroll')
  public async enrollUser(
    @Query('login') login: string,
    @Query('password') password: string,
  ): Promise<{ role: string }> {
    return this.enrollService.enrollUser(login, password);
  }
}
