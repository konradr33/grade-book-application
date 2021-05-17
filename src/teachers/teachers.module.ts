import { Module } from '@nestjs/common';
import { TeachersController } from './teachers.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [TeachersController],
})
export class TeachersModule {}
