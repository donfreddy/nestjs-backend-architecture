import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { User } from '../user/schemas/user.schema';
import { BlogRepository } from './blog.repository';
import { Blog, BlogDocument } from './schemas/blog.schema';
import { formatEndpoint } from '../../common/helpers';
import { Types } from 'mongoose';
import { ApiPaginatedResponse, PaginationOpts } from '../../common/interfaces';

@Injectable()
export class BlogService {
  constructor(private blogRepo: BlogRepository) {}

  async create(user: User, inputs: CreateBlogDto): Promise<BlogDocument> {
    const blogUrl = formatEndpoint(inputs.blog_url);

    const existingBlog = await this.blogRepo.findUrlIfExists(blogUrl);
    if (existingBlog) throw new BadRequestException({ key: 'blog.blog_url_already_exists' });

    const newBlog = {
      title: inputs.title,
      description: inputs.description,
      draftText: inputs.text,
      tags: inputs.tags,
      author: user,
      blogUrl: blogUrl,
      imgUrl: inputs.img_url,
      createdBy: user,
      updatedBy: user,
    } as Blog;

    return await this.blogRepo.create(newBlog);
  }

  async update(user: User, id: string, inputs: UpdateBlogDto): Promise<BlogDocument> {
    const blog = await this.blogRepo.findBlogAllDataById(new Types.ObjectId(id));
    if (!blog) throw new BadRequestException({ key: 'blog.blog_not_exist' });

    if (!blog.author._id.equals(user._id)) {
      throw new ForbiddenException({ key: 'blog.not_have_permission' });
    }

    if (inputs.blog_url && blog.blogUrl !== inputs.blog_url) {
      const endpoint = formatEndpoint(inputs.blog_url);
      const existingBlog = await this.blogRepo.findUrlIfExists(endpoint);
      if (existingBlog) throw new BadRequestException({ key: 'blog.blog_url_already_exists' });
      blog.blogUrl = endpoint;
    }

    if (inputs.title) blog.title = inputs.title;
    if (inputs.description) blog.description = inputs.description;
    if (inputs.text) blog.draftText = inputs.text;
    if (inputs.tags) blog.tags = inputs.tags;
    if (inputs.img_url) blog.imgUrl = inputs.img_url;
    if (inputs.score) blog.score = inputs.score;

    blog.updatedAt = new Date();
    await this.blogRepo.updateOne({ _id: blog._id }, blog);
    return blog;
  }

  async submit(user: User, id: string): Promise<BlogDocument> {
    const blog = await this.blogRepo.findBlogAllDataById(new Types.ObjectId(id));
    if (!blog) throw new BadRequestException({ key: 'blog.blog_not_exist' });

    if (!blog.author._id.equals(user._id)) {
      throw new ForbiddenException({ key: 'blog.not_have_permission' });
    }

    Object.assign(blog, { isSubmitted: true, isDraft: false, updatedAt: new Date() });

    await this.blogRepo.updateOne({ _id: blog._id }, blog);
    return blog;
  }

  async withdraw(user: User, id: string): Promise<BlogDocument> {
    const blog: BlogDocument = await this.blogRepo.findBlogAllDataById(new Types.ObjectId(id));
    if (!blog) throw new BadRequestException({ key: 'blog.blog_not_exist' });

    if (!blog.author._id.equals(user._id)) {
      throw new ForbiddenException({ key: 'blog.not_have_permission' });
    }

    Object.assign(blog, { isSubmitted: false, isDraft: true, updatedAt: new Date() });

    await this.blogRepo.updateOne({ _id: blog._id }, blog);
    return blog;
  }

  async delete(user: User, id: string): Promise<BlogDocument> {
    const blog: BlogDocument = await this.blogRepo.findBlogAllDataById(new Types.ObjectId(id));
    if (!blog) throw new BadRequestException({ key: 'blog.blog_not_exist' });

    if (!blog.author._id.equals(user._id)) {
      throw new ForbiddenException({ key: 'blog.not_have_permission' });
    }

    if (blog.isPublished) {
      Object.assign(blog, { isDraft: false, draftText: blog.text });
    } else {
      Object.assign(blog, { status: false });
    }

    await this.blogRepo.updateOne({ _id: blog._id }, blog);
    return blog;
  }

  async allSubmitted(user: User): Promise<BlogDocument[]> {
    return this.blogRepo.findDetailedBlogs({ author: user, status: true, isSubmitted: true });
  }

  async allPublished(user: User): Promise<BlogDocument[]> {
    return this.blogRepo.findDetailedBlogs({ author: user, status: true, isPublished: true });
  }

  async allDrafts(user: User): Promise<BlogDocument[]> {
    return this.blogRepo.findDetailedBlogs({ author: user, status: true, isDraft: true });
  }

  async findById(user: User, id: string): Promise<BlogDocument> {
    const blog = await this.blogRepo.findBlogAllDataById(new Types.ObjectId(id));
    if (!blog) throw new BadRequestException({ key: 'blog.blog_not_exist' });

    if (!blog.author._id.equals(user._id)) {
      throw new ForbiddenException({ key: 'blog.not_have_permission' });
    }

    return blog;
  }

  async publish(id: string): Promise<BlogDocument> {
    const blog: BlogDocument = await this.blogRepo.findBlogAllDataById(new Types.ObjectId(id));
    if (!blog) throw new BadRequestException({ key: 'blog.blog_not_exist' });

    Object.assign(blog, {
      isDraft: false,
      isSubmitted: false,
      isPublished: true,
      text: blog.draftText,
      publishedAt: blog.publishedAt || new Date(),
    });

    await this.blogRepo.updateOne({ _id: blog._id }, blog);
    return blog;
  }

  async unpublish(id: string): Promise<BlogDocument> {
    const blog = await this.blogRepo.findBlogAllDataById(new Types.ObjectId(id));
    if (!blog) throw new BadRequestException({ key: 'blog.blog_not_exist' });

    Object.assign(blog, { isDraft: true, isSubmitted: false, isPublished: false });

    await this.blogRepo.updateOne({ _id: blog._id }, blog);
    return blog;
  }

  async findPublishedByUrl(endpoint: string): Promise<BlogDocument> {
    const blog = await this.blogRepo.findPublishedByUrl(endpoint);
    if (!blog) throw new BadRequestException({ key: 'blog.blog_not_found' });

    return blog;
  }

  async findPublishedById(id: string): Promise<BlogDocument> {
    const blog = await this.blogRepo.findInfoForPublishedById(new Types.ObjectId(id));
    if (!blog) throw new BadRequestException({ key: 'blog.blog_not_found' });

    return blog;
  }

  async findByTag(tag: string, options: PaginationOpts): Promise<ApiPaginatedResponse<Blog>>  {
    return await this.blogRepo.findByTagAndPaginated(tag, options);
  }

  async allPublishedForAuthor(id: string): Promise<BlogDocument[]> {
    return await this.blogRepo.findAllPublishedForAuthor({
      _id: new Types.ObjectId(id),
    } as User);
  }

  async latest(options: PaginationOpts): Promise<ApiPaginatedResponse<Blog>> {
    return await this.blogRepo.findLatestBlogs(options);
  }

  async similar(id: string): Promise<BlogDocument[]> {
    const blogId = new Types.ObjectId(id);
    const blog = await this.blogRepo.findInfoForPublishedById(blogId);
    if (!blog) throw new BadRequestException({ key: 'blog.blog_not_available' });

    const blogs = await this.blogRepo.searchSimilarBlogs(blog, 6);

    return blogs ? blogs : [];
  }
}
