import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { jwtConstants } from './constants/constants';
import { JwtStrategy } from './guard/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '6000s' },
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
