import { Prop } from '@nestjs/mongoose';

export class BaseSchema {
  @Prop({ name: 'created_at' })
  createdAt: Date;

  @Prop({ name: 'updated_at' })
  updatedAt: Date;
}
