import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsUrl } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  readonly name?: string;

  @IsUrl()
  @IsString()
  readonly profilePicUrl?: string;
}
