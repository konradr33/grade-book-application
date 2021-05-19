import { Module } from '@nestjs/common';
import { StudentsModule } from './students/students.module';
import { AuthModule } from './auth/auth.module';
import { TeachersModule } from './teachers/teachers.module';

@Module({
  imports: [StudentsModule, AuthModule, TeachersModule],
})
export class AppModule {}
