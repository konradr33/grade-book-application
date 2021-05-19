import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from '../service/auth.service';
import { LoginDto } from '../../models/login.dto';

@Controller()
export class AuthController {
  constructor(private enrollService: AuthService) {}

  @Post('login')
  public async login(@Body() user: LoginDto): Promise<{ role: string }> {
    return this.enrollService.login(user.username, user.password);
  }
}
