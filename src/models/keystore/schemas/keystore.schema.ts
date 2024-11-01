import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Document } from 'mongoose';
import { User } from '../../user/schemas/user.schema';

@Schema({ collection: 'keystores' })
export class Keystore {
  @Prop()
  primaryKey: string;

  @Prop()
  secondaryKey: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  client: User;

  @Prop({ default: true })
  status: boolean;

  @Prop({ name: 'created_at' })
  createdAt: Date;

  @Prop({ name: 'updated_at' })
  updatedAt: Date;
}

export const KeystoreSchema = SchemaFactory.createForClass(Keystore);

export type KeystoreDocument = Keystore & Document;
