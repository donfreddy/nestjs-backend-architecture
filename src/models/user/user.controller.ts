import { Get, Body, Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiResponse, Auth, Permission } from '../../common/decorators';
import { RoleCode } from '../../common/helpers';
import { LoginDto } from '../../auth/dto/auth.dto';
import { User } from './schemas/user.schema';

@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/assign')
  @Permission('GENERAL')
  @Auth(RoleCode.ADMIN)
  @ApiResponse({ key: 'auth.success.user_password_updated' })
  getAssignUser(@Body() inputs: LoginDto): Promise<Partial<User>> {
    return this.userService.assign(inputs);
  }
}
