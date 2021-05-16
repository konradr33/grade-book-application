import { Module } from '@nestjs/common';
import { EnrollController } from './enroll/enroll.controller';
import { EnrollService } from './enroll/enroll.service';
import { WalletStrategy } from './passport/wallet.strategy';
import { WalletAuthGuard } from './passport/wallet-auth.guard';

@Module({
  controllers: [EnrollController],
  providers: [EnrollService, WalletStrategy, WalletAuthGuard],
  exports: [EnrollService],
})
export class AuthModule {}
