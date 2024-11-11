import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { EditorController } from './editor.controller';
import { BlogsController } from './blogs.controller';
import { WriterController } from './writer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './schemas/blog.schema';
import { BlogRepository } from './blog.repository';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }])],
  controllers: [BlogController, WriterController, EditorController, BlogsController],
  providers: [BlogService, BlogRepository, JwtService],
})
export class BlogModule {}
