import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../models/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService,],
})
export class AuthModule {}
