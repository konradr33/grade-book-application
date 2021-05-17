import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';
import { AuthModule } from './auth/auth.module';
import { TeachersModule } from './teachers/teachers.module';

@Module({
  imports: [StudentsModule, AuthModule, TeachersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
