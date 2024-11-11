import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { BlogService } from './blog.service';
import {  ApiResponse, Permission } from '../../common/decorators';
import { BlogDocument } from './schemas/blog.schema';
import { FindByIdDto } from '../../common/dtos/find-by-id.dto';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../common/constants';

@Controller({ path: 'blogs', version: '1' })
export class BlogsController {
  constructor(private readonly blogService: BlogService) {}

  @Get('/tag/:tag')
  @Permission('GENERAL')
  @ApiResponse({ key: 'common.success' })
  findByTag(
    @Param('tag') tag: string,
    @Query('page', new DefaultValuePipe(DEFAULT_PAGE), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(DEFAULT_LIMIT), ParseIntPipe) limit: number,
  ) {
    return this.blogService.findByTag(tag, { page, limit });
  }

  @Get('/author/id/:id')
  @Permission('GENERAL')
  @ApiResponse({ key: 'common.success' })
  allPublishedForAuthor(@Param() params: FindByIdDto): Promise<BlogDocument[]> {
    return this.blogService.allPublishedForAuthor(params.id);
  }

  @Get('/latest')
  @Permission('GENERAL')
  @ApiResponse({ key: 'common.success' })
  latest(
    @Query('page', new DefaultValuePipe(DEFAULT_PAGE), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(DEFAULT_LIMIT), ParseIntPipe) limit: number,
  ) {
    return this.blogService.latest({ page, limit });
  }

  @Get('/similar/id/:id')
  @Permission('GENERAL')
  @ApiResponse({ key: 'common.success' })
  similar(@Param() params: FindByIdDto): Promise<BlogDocument[]> {
    return this.blogService.similar(params.id);
  }
}
