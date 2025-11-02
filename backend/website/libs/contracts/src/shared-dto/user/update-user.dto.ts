import { PartialType } from '@nestjs/mapped-types';
import { UserDto } from './user.dto';

export class UpdateProfileUserDto extends PartialType(UserDto) {
  desc?: string | undefined;
  profile_picture?: string | undefined;
}
