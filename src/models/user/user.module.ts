import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { ProfileController } from './profile.controller';
import { RoleModule } from '../role/role.module';
import { KeystoreModule } from '../keystore/keystore.module';
import { UserController } from './user.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RoleModule,
    KeystoreModule,
  ],
  controllers: [UserController, ProfileController],
  providers: [UserService, JwtService],
  exports: [UserService, RoleModule, KeystoreModule],
})
export class UserModule {}
