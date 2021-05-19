import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';

import { AuthService } from '../service/auth.service';
import { LoginDto } from '../../models/login.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';

@Controller()
export class AuthController {
  constructor(private enrollService: AuthService) {}

  @Post('login')
  public async login(@Body() user: LoginDto): Promise<{ username: string; token: string; role: string }> {
    return this.enrollService.login(user.username, user.password);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  public me(@Request() req): { username: string; role: string } {
    return req.user;
  }
}
