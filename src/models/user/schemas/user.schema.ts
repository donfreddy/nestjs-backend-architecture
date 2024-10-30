import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as Schema2 } from 'mongoose';
import { Role } from '../../role/schemas/role.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'users' })
export class User  {
  @Prop({ maxlength: 200 })
  name: string;

  @Prop({ unique: true, sparse: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ name: 'profile_pic_url' })
  profilePicUrl: string;

  @Prop({ type: [{ type: Schema2.Types.ObjectId, ref: 'Role' }] })
  roles: Role[];

  @Prop({ default: true })
  verified: boolean;

  @Prop({ default: true })
  status: boolean;

  @Prop({ name: 'created_at' })
  createdAt: Date;

  @Prop({ name: 'updated_at' })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
