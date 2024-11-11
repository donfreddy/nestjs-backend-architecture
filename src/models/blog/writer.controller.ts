import { Controller, Get, Post, Body, Param, Delete, Req, Put } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { ProtectedRequest } from '../../types/app-request';
import { ApiResponse, Auth, Permission } from '../../common/decorators';
import { RoleCode } from '../../common/helpers';
import { FindByIdDto } from '../../common/dtos/find-by-id.dto';
import { BlogDocument } from './schemas/blog.schema';

@Controller({ path: 'writer/blog', version: '1' })
export class WriterController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @Permission('GENERAL')
  @Auth(RoleCode.WRITER)
  @ApiResponse({ key: 'blog.blog_created' })
  create(@Req() req: ProtectedRequest, @Body() inputs: CreateBlogDto): Promise<BlogDocument> {
    return this.blogService.create(req.user, inputs);
  }

  @Put('/id/:id')
  @Permission('GENERAL')
  @Auth(RoleCode.WRITER)
  @ApiResponse({ key: 'blog.blog_updated' })
  update(
    @Req() req: ProtectedRequest,
    @Param() params: FindByIdDto,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<BlogDocument> {
    return this.blogService.update(req.user, params.id, updateBlogDto);
  }

  @Put('/submit/:id')
  @Permission('GENERAL')
  @Auth(RoleCode.WRITER)
  @ApiResponse({ key: 'blog.blog_submitted' })
  submit(@Req() req: ProtectedRequest, @Param() params: FindByIdDto): Promise<BlogDocument> {
    return this.blogService.submit(req.user, params.id);
  }

  @Put('/withdraw/:id')
  @Permission('GENERAL')
  @Auth(RoleCode.WRITER)
  @ApiResponse({ key: 'blog.blog_withdrawn' })
  withdraw(@Req() req: ProtectedRequest, @Param() params: FindByIdDto): Promise<BlogDocument> {
    return this.blogService.withdraw(req.user, params.id);
  }

  @Delete('/id/:id')
  @Permission('GENERAL')
  @Auth(RoleCode.WRITER)
  @ApiResponse({ key: 'blog.blog_deleted' })
  delete(@Req() req: ProtectedRequest, @Param() params: FindByIdDto): Promise<BlogDocument> {
    return this.blogService.delete(req.user, params.id);
  }

  @Get('/submitted/all')
  @Permission('GENERAL')
  @Auth(RoleCode.WRITER)
  @ApiResponse({ key: 'common.success' })
  allSubmitted(@Req() req: ProtectedRequest): Promise<BlogDocument[]> {
    return this.blogService.allSubmitted(req.user);
  }

  @Get('/published/all')
  @Permission('GENERAL')
  @Auth(RoleCode.WRITER)
  @ApiResponse({ key: 'common.success' })
  allPublished(@Req() req: ProtectedRequest): Promise<BlogDocument[]> {
    return this.blogService.allPublished(req.user);
  }

  @Get('/drafts/all')
  @Permission('GENERAL')
  @Auth(RoleCode.WRITER)
  @ApiResponse({ key: 'common.success' })
  allDrafts(@Req() req: ProtectedRequest): Promise<BlogDocument[]> {
    return this.blogService.allDrafts(req.user);
  }

  @Get('/id/:id')
  @Permission('GENERAL')
  @Auth(RoleCode.WRITER)
  @ApiResponse({ key: 'common.success' })
  findById(@Req() req: ProtectedRequest, @Param() params: FindByIdDto): Promise<BlogDocument> {
    return this.blogService.findById(req.user, params.id);
  }
}
