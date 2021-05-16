import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [StudentsController],
})
export class StudentsModule {}
