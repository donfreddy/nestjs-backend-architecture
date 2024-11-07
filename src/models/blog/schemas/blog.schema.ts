import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as Schema2, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';

@Schema({ collection: 'blogs' })
export class Blog {
  @Prop({ type: Schema2.Types.ObjectId, auto: true })
  readonly _id: Types.ObjectId;

  @Prop({ required: true, maxlength: 500 })
  title: string;

  @Prop({ required: true, maxlength: 2000 })
  description: string;

  @Prop()
  text: string;

  @Prop()
  draftText: string;

  @Prop({ uppercase: true })
  tags: string[];

  @Prop({ type: Schema2.Types.ObjectId, ref: 'User', required: true, index: true })
  author: User;

  @Prop({ maxlength: 500 })
  imgUrl: string;

  @Prop({ maxlength: 200 })
  blogUrl: string;

  @Prop({ default: 0 })
  likes: number;

  @Prop({ default: 0.01, max: 1, min: 0 })
  score: number;

  @Prop({ select: false, index: true })
  isSubmitted: boolean;

  @Prop({ select: false, index: true })
  isDraft: boolean;

  @Prop({ select: false, index: true })
  isPublished: boolean;

  @Prop({ required: false, index: true })
  publishedAt: Date;

  @Prop({ default: true })
  status: boolean;

  @Prop({ type: Schema2.Types.ObjectId, ref: 'User', required: true, index: true })
  createdBy: User;

  @Prop({ type: Schema2.Types.ObjectId, ref: 'User', required: true })
  updatedBy: User;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

export type BlogDocument = HydratedDocument<Blog>;

// Remove the _id field and __v field from the returned object
BlogSchema.set('toJSON', {
  transform: (_doc: BlogDocument, ret: Record<string, any>): void => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});
