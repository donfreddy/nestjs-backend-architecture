import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BlogDocument } from '../models/blog/schemas/blog.schema';
import { DynamicCacheKey, getDynamicCacheKey } from './cache-keys';
import { Types } from 'mongoose';
import { configService } from '../config/config.service';

@Injectable()
export class BlogCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  // Cache TTL constants
  private readonly CACHE_TTL = configService.getCaching().contentCacheDuration;

  // Blog by url
  async getBlogByUrl(blogUrl: string): Promise<BlogDocument | null> {
    return await this.cacheManager.get<BlogDocument>(
      getDynamicCacheKey(DynamicCacheKey.BLOG, blogUrl),
    );
  }

  async setBlogByUrl(url: string, blog: BlogDocument): Promise<void> {
    await this.cacheManager.set(
      getDynamicCacheKey(DynamicCacheKey.BLOG, blog.blogUrl),
      blog,
      this.CACHE_TTL,
    );
  }

  // Blog by id
  async getBlogById(blogId: Types.ObjectId): Promise<BlogDocument | null> {
    return await this.cacheManager.get<BlogDocument>(
      getDynamicCacheKey(DynamicCacheKey.BLOG, blogId.toHexString()),
    );
  }

  async setBlogById(id: string, blog: any): Promise<void> {
    await this.cacheManager.set(getDynamicCacheKey(DynamicCacheKey.BLOG, id), blog, this.CACHE_TTL);
  }

  // Similar blogs
  async getSimilarBlogs(blogId: Types.ObjectId): Promise<BlogDocument[] | null> {
    return await this.cacheManager.get<BlogDocument[]>(
      getDynamicCacheKey(DynamicCacheKey.BLOGS_SIMILAR, blogId.toHexString()),
    );
  }

  async setSimilarBlogs(blogId: Types.ObjectId, blogs: BlogDocument[]): Promise<void> {
    await this.cacheManager.set(
      getDynamicCacheKey(DynamicCacheKey.BLOGS_SIMILAR, blogId.toHexString()),
      blogs,
      this.CACHE_TTL,
    );
  }
}
