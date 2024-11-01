import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as Schema2, Types } from 'mongoose';
import { RoleCode } from '../../../common/helpers';

@Schema({ collection: 'roles' })
export class Role {
  @Prop({ type: Schema2.Types.ObjectId, auto: true })
  readonly _id: Types.ObjectId;

  @Prop({
    required: true,
    enum: Object.values(RoleCode),
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

export type RoleDocument = Role & Document;

// Remove the _id field and __v field from the returned object
RoleSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});
