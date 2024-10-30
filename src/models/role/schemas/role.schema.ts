import { RoleCode } from '../../../common/helpers';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IRole } from '../interface/role.interface';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ collection: 'roles' })
export class Role implements IRole {
  @Prop({
    //type: 'enum',
    //enum: [RoleCode.LEARNER, RoleCode.WRITER, RoleCode.EDITOR, RoleCode.ADMIN],
  })
  code: string;

  @Prop({ length: 100 })
  version: number;

  @Prop({ default: true })
  status: boolean;

  @Prop({ name: 'created_at' })
  createdAt: Date;

  @Prop({ name: 'updated_at' })
  updatedAt: Date;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
