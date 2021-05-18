import { Controller, Get, Query } from '@nestjs/common';

import { AuthService } from '../service/auth.service';

@Controller()
export class AuthController {
  constructor(private enrollService: AuthService) {}

  @Get('login')
  public async login(
    @Query('username') username: string,
    @Query('password') password: string,
  ): Promise<{ role: string }> {
    return this.enrollService.login(username, password);
  }
}
