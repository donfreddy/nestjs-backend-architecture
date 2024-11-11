import { Controller, Get, Param, Delete, Put, Req } from '@nestjs/common';
import { BlogService } from './blog.service';
import { ApiResponse, Auth, Permission } from '../../common/decorators';
import { RoleCode } from '../../common/helpers';
import { ProtectedRequest } from '../../types/app-request';
import { FindByIdDto } from '../../common/dtos/find-by-id.dto';
import { BlogDocument } from './schemas/blog.schema';

@Controller({ path: 'editor/blog', version: '1' })
export class EditorController {
  constructor(private readonly blogService: BlogService) {}

  @Put('/publish/:id')
  @Permission('GENERAL')
  @Auth(RoleCode.ADMIN, RoleCode.EDITOR)
  @ApiResponse({ key: 'blog.blog_published' })
  publish(@Param() params: FindByIdDto): Promise<BlogDocument> {
    return this.blogService.publish(params.id);
  }

  @Put('/unpublish/:id')
  @Permission('GENERAL')
  @Auth(RoleCode.ADMIN, RoleCode.EDITOR)
  @ApiResponse({ key: 'blog.blog_unpublished' })
  unpublish(@Param() params: FindByIdDto): Promise<BlogDocument> {
    return this.blogService.unpublish(params.id);
  }

  @Delete('/id/:id')
  @Permission('GENERAL')
  @Auth(RoleCode.ADMIN, RoleCode.EDITOR)
  @ApiResponse({ key: 'blog.blog_deleted' })
  delete(@Req() req: ProtectedRequest, @Param() params: FindByIdDto): Promise<BlogDocument> {
    return this.blogService.delete(req.user, params.id);
  }

  @Get('/published/all')
  @Permission('GENERAL')
  @Auth(RoleCode.ADMIN, RoleCode.EDITOR)
  @ApiResponse({ key: 'common.success' })
  allPublished(@Req() req: ProtectedRequest): Promise<BlogDocument[]> {
    return this.blogService.allPublished(req.user);
  }

  @Get('/submitted/all')
  @Permission('GENERAL')
  @Auth(RoleCode.ADMIN, RoleCode.EDITOR)
  @ApiResponse({ key: 'common.success' })
  allSubmitted(@Req() req: ProtectedRequest): Promise<BlogDocument[]> {
    return this.blogService.allSubmitted(req.user);
  }

  @Get('/drafts/all')
  @Permission('GENERAL')
  @Auth(RoleCode.ADMIN, RoleCode.EDITOR)
  @ApiResponse({ key: 'common.success' })
  allDrafts(@Req() req: ProtectedRequest): Promise<BlogDocument[]> {
    return this.blogService.allDrafts(req.user);
  }

  @Get('/id/:id')
  @Permission('GENERAL')
  @Auth(RoleCode.ADMIN, RoleCode.EDITOR)
  @ApiResponse({ key: 'common.success' })
  findById(@Req() req: ProtectedRequest, @Param() params: FindByIdDto): Promise<BlogDocument> {
    return this.blogService.findById(req.user, params.id);
  }
}
