import { Module } from '@nestjs/common';
import { EnrollController } from './enroll/enroll.controller';



@Module({
  controllers: [EnrollController],
})
export class AuthModule {}
