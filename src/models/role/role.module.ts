import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './schemas/role.schema';
//import { RoleController } from './role.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }])],
  //controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
