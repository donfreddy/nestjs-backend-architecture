import { Get, Body, Param, Controller, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @Get('/my')
  getMyProfile() {
    return this.userService.findAll();
  }

  // Get public profile by id
  @Get('/public/:id')
  getPublicProfile(@Param('id') id: string) {
    //return this.userService.findOne(+id);
  }

  @Put('')
  updateProfile(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    //return this.userService.update(+id, updateUserDto);
  }
}
