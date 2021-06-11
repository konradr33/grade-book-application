import { Module } from '@nestjs/common';
import { IdentityController } from './identity.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [IdentityController],
})
export class IdentityModule {}
