import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/repositories/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './schemas/blog.schema';
import { Model, Types } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { AUTHOR_DETAIL } from '../../common/constants';
import { ApiPaginatedResponse, PaginationOpts } from '../../common/interfaces';

@Injectable()
export class BlogRepository extends BaseRepository<BlogDocument> {
  constructor(@InjectModel(Blog.name) userModel: Model<BlogDocument>) {
    super(userModel);
  }

  async findUrlIfExists(blogUrl: string): Promise<BlogDocument | null> {
    return this.findOne({ blogUrl: blogUrl }).exec();
  }

  async findBlogAllDataById(id: Types.ObjectId): Promise<BlogDocument | null> {
    return this.findOne(
      { _id: id, status: true },
      {
        select: '+text +draftText +isSubmitted +isDraft +isPublished +status +createdBy +updatedBy',
        populate: { path: 'author', select: AUTHOR_DETAIL },
        lean: true,
      },
    );
  }

  async findDetailedBlogs(query: Record<string, unknown>): Promise<BlogDocument[]> {
    return this.findAll(query, {
      select: '+isSubmitted +isDraft +isPublished +createdBy +updatedBy',
      populate: [
        { path: 'author', select: AUTHOR_DETAIL },
        { path: 'createdBy', select: AUTHOR_DETAIL },
        { path: 'updatedBy', select: AUTHOR_DETAIL },
      ],
      sort: { updatedAt: -1 },
      lean: true,
    });
  }

  async findPublishedByUrl(blogUrl: string): Promise<BlogDocument | null> {
    return this.findOne(
      {
        blogUrl: blogUrl,
        isPublished: true,
        status: true,
      },
      {
        select: '+text',
        populate: { path: 'author', select: AUTHOR_DETAIL },
        lean: true,
      },
    );
  }

  async findInfoForPublishedById(id: Types.ObjectId): Promise<BlogDocument | null> {
    return this.findOne(
      { _id: id, isPublished: true, status: true },
      {
        select: '+text',
        populate: { path: 'author', select: AUTHOR_DETAIL },
        lean: true,
      },
    );
  }

  async findByTagAndPaginated(
    tag: string,
    options: PaginationOpts,
  ): Promise<ApiPaginatedResponse<Blog>> {
    return this.findWithPagination({ tags: tag, status: true, isPublished: true }, options, {
      populate: { path: 'author', select: AUTHOR_DETAIL },
      sort: { publishedAt: -1 },
      lean: true,
    });
  }

  async findAllPublishedForAuthor(user: User): Promise<BlogDocument[]> {
    return this.findAll(
      { author: user, status: true, isPublished: true },
      {
        populate: { path: 'author', select: AUTHOR_DETAIL },
        sort: { publishedAt: -1 },
        lean: true,
      },
    );
  }

  async findLatestBlogs(paginationOpts: PaginationOpts): Promise<ApiPaginatedResponse<Blog>> {
    return this.findWithPagination({ status: true, isPublished: true }, paginationOpts, {
      populate: { path: 'author', select: AUTHOR_DETAIL },
      sort: { publishedAt: -1 },
      lean: true,
    });
  }

  async searchSimilarBlogs(blog: BlogDocument, limit: number): Promise<BlogDocument[]> {
    return this.findAll(
      {
        $text: { $search: blog.title, $caseSensitive: false },
        status: true,
        isPublished: true,
        _id: { $ne: blog._id },
      },
      {
        similarity: { $meta: 'textScore' },
        populate: { path: 'author', select: AUTHOR_DETAIL },
        limit,
        sort: { publishedAt: -1, similarity: { $meta: 'textScore' } },
        lean: true,
      },
    );
  }

  async search(query: string, paginationOpts: PaginationOpts): Promise<ApiPaginatedResponse<Blog>> {
    return this.findWithPagination(
      {
        $text: { $search: query, $caseSensitive: false },
        status: true,
        isPublished: true,
      },
      paginationOpts,
      {
        similarity: { $meta: 'textScore' },
        select: '-status -description',
        sort: { similarity: { $meta: 'textScore' } },
      },
    );
  }

  async searchLike(
    query: string,
    paginationOpts: PaginationOpts,
  ): Promise<ApiPaginatedResponse<Blog>> {
    return this.findWithPagination(
      {
        title: { $regex: `.*${query}.*`, $options: 'i' },
        status: true,
        isPublished: true,
      },
      paginationOpts,
      {
        select: '-status -description',
        sort: { score: -1 },
      },
    );
  }
}
