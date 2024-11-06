import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, IsUrl } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsUrl()
  @IsString()
  @IsOptional()
  readonly profile_pic_url?: string;
}
