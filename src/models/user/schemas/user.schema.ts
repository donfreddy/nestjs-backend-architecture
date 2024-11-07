import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as Schema2, Types } from 'mongoose';
import { Role } from '../../role/schemas/role.schema';

@Schema({ collection: 'users' })
export class User {
  @Prop({ type: Schema2.Types.ObjectId, auto: true })
  readonly _id: Types.ObjectId;

  @Prop({ maxlength: 200 })
  name: string;

  @Prop({ unique: true, sparse: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  profilePicUrl: string;

  @Prop({ type: [{ type: Schema2.Types.ObjectId, ref: 'Role' }] })
  roles: Role[];

  @Prop({ default: true })
  verified: boolean;

  @Prop({ default: true })
  status: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = HydratedDocument<User>;

// Remove the _id field and __v field from the returned object
UserSchema.set('toJSON', {
  transform: (_doc: UserDocument, ret: Record<string, any>): void => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});
