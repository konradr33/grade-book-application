import { Module } from '@nestjs/common';
import { StudentsModule } from './students/students.module';
import { AuthModule } from './auth/auth.module';
import { TeachersModule } from './teachers/teachers.module';
import { IdentityModule } from './identity/identity.module';

@Module({
  imports: [StudentsModule, AuthModule, TeachersModule, IdentityModule],
})
export class AppModule {}
