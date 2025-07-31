import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { JobModule } from './job/job.module';

@Module({
  imports: [AuthModule, UserModule, JobModule],
})
export class AppModule {}
