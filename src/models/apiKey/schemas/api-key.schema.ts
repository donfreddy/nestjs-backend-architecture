import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'api_keys' })
export class ApiKey  {
  @Prop({ length: 1024, unique: true })
  key: string;

  @Prop({ length: 100 })
  version: number;

  @Prop()
  metadata: string;

  @Prop({ default: true })
  status: boolean;

  @Prop({ name: 'created_at' })
  createdAt: Date;

  @Prop({ name: 'updated_at' })
  updatedAt: Date;
}

export const ApiKeySchema = SchemaFactory.createForClass(ApiKey);

export type ApiKeyDocument = ApiKey & Document;
