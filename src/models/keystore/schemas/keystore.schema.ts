import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as Schema2, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';

@Schema({ collection: 'keystores' })
export class Keystore {
  @Prop({ type: Schema2.Types.ObjectId, auto: true })
  readonly _id: Types.ObjectId;

  @Prop()
  primaryKey: string;

  @Prop()
  secondaryKey: string;

  @Prop({ type: Schema2.Types.ObjectId, ref: 'User' })
  client: User;

  @Prop({ default: true })
  status: boolean;

  @Prop({ alias: 'created_at' })
  createdAt: Date;

  @Prop({ alias: 'updated_at' })
  updatedAt: Date;
}

export const KeystoreSchema = SchemaFactory.createForClass(Keystore);

export type KeystoreDocument = Keystore & Document;

// Remove the _id field and __v field from the returned object
KeystoreSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});
