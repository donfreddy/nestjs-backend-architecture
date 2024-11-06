import { Get, Body, Controller, Put, Req, UseGuards, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { Types } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { ProtectedRequest } from '../../types/app-request';
import { ApiResponse, Permission } from '../../common/decorators';
import { PermissionEnum } from '../../common/helpers';
import { AuthGuard } from '../../common/guards';
import { FindByIdDto } from '../../common/dtos/find-by-id.dto';

@Controller({ path: 'profile', version: '1' })
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Permission(PermissionEnum.GENERAL)
  @UseGuards(AuthGuard)
  @ApiResponse({ key: 'common.success' })
  getPrivateProfile(@Req() req: ProtectedRequest): Promise<Partial<User>> {
    return this.userService.getPrivateProfile(req.user._id);
  }

  @Get('public/:id')
  @Permission(PermissionEnum.GENERAL)
  @ApiResponse({ key: 'common.success' })
  getPublicProfile(@Param() params: FindByIdDto): Promise<Partial<User>> {
    return this.userService.getPublicProfile(new Types.ObjectId(params.id));
  }

  @Put()
  @Permission(PermissionEnum.GENERAL)
  @UseGuards(AuthGuard)
  @ApiResponse({ key: 'auth.success.profile_updated' })
  updateProfile(@Req() req: ProtectedRequest, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateProfile(req.user._id, updateUserDto);
  }
}
