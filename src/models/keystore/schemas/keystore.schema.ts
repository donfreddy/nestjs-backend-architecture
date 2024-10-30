import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as Schema2 } from 'mongoose';
import { IKeystore } from '../interface/keystore.interface';
import { User } from '../../user/schemas/user.schema';

export type KeystoreDocument = HydratedDocument<Keystore>;

@Schema({ collection: 'keystores' })
export class Keystore implements IKeystore {
  @Prop()
  primaryKey: string;

  @Prop()
  secondaryKey: string;

  @Prop({ type: { type: Schema2.Types.ObjectId, ref: 'User' } })
  client: User;

  @Prop({ default: true })
  status: boolean;

  @Prop({ name: 'created_at' })
  createdAt: Date;

  @Prop({ name: 'updated_at' })
  updatedAt: Date;
}

export const KeystoreSchema = SchemaFactory.createForClass(Keystore);