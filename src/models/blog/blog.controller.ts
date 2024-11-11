import { Controller, Get, Param, Query } from '@nestjs/common';
import { BlogService } from './blog.service';
import { ApiResponse, Permission } from '../../common/decorators';
import { BlogDocument } from './schemas/blog.schema';
import { FindByIdDto } from '../../common/dtos/find-by-id.dto';

@Controller({ path: 'blog', version: '1' })
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get('/url')
  @Permission('GENERAL')
  @ApiResponse({ key: 'common.success' })
  findByUrl(@Query('endpoint') endpoint: string): Promise<BlogDocument> {
    return this.blogService.findPublishedByUrl(endpoint);
  }

  @Get('/id/:id')
  @Permission('GENERAL')
  @ApiResponse({ key: 'common.success' })
  findById(@Param() params: FindByIdDto): Promise<BlogDocument> {
    return this.blogService.findPublishedById(params.id);
  }
}
