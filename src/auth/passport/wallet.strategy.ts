import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { EnrollService } from '../enroll/enroll.service';

@Injectable()
export class WalletStrategy extends PassportStrategy(Strategy, 'walletStrategy') {
  constructor(private enrollService: EnrollService) {
    super({
      passwordField: 'username',
    });
  }

  async validate(username: string, password: string): Promise<any> {
    console.log('validate');
    const user = await this.enrollService.isUserEnrolled(username);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
