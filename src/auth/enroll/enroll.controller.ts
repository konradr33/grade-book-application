import { Controller, Get, Query } from '@nestjs/common';

import { EnrollService } from './enroll.service';

@Controller('enroll')
export class EnrollController {
  constructor(private enrollService: EnrollService) {}

  @Get()
  public async enrollUser(@Query('login') login: string, @Query('password') password: string) {
    await this.enrollService.enrollUser(login, password);
  }
}
