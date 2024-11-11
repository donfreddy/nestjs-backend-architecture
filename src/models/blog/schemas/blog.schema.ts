import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as Schema2 } from 'mongoose';
import { User } from '../../user/schemas/user.schema';

@Schema({ collection: 'blogs', versionKey: false })
export class Blog {
  @Prop({ required: true, maxlength: 500 })
  title: string;

  @Prop({ required: true, maxlength: 2000 })
  description: string;

  @Prop({ required: false, select: false })
  text: string;

  @Prop({ required: true, select: false })
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

  @Prop({ default: true, select: false })
  status: boolean;

  @Prop({
    type: Schema2.Types.ObjectId,
    ref: 'User',
    required: true,
    select: false,
    index: true,
  })
  createdBy: User;

  @Prop({ type: Schema2.Types.ObjectId, ref: 'User', required: true, select: false })
  updatedBy: User;

  @Prop({ default: Date.now, select: false })
  createdAt: Date;

  @Prop({ default: Date.now, select: false })
  updatedAt: Date;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

export type BlogDocument = HydratedDocument<Blog>;

BlogSchema.index(
  { title: 'text', description: 'text' },
  { weights: { title: 3, description: 1 }, background: false },
);
BlogSchema.index({ _id: 1, status: 1 });
BlogSchema.index({ blogUrl: 1, status: 1 });
BlogSchema.index({ isPublished: 1, status: 1 });
BlogSchema.index({ _id: 1, isPublished: 1, status: 1 });
BlogSchema.index({ tag: 1, isPublished: 1, status: 1 });
