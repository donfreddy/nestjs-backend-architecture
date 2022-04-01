import { ProfileController } from './profile.controller';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  controllers: [ProfileController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
