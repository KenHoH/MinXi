import { PartialType } from '@nestjs/mapped-types';
import { UserDto } from './user.dto';

export class UpdateProfileUserDto extends PartialType(UserDto) {
  desc?: string | undefined;
  profile_picture?: string | undefined;
}

export class UpdateRestriction extends PartialType(UserDto) {
  content_visibilityPrivate?: boolean | undefined;
  liked_visibilityPrivate?: boolean | undefined;
  pinned_visibilityPrivate?: boolean | undefined;
}
