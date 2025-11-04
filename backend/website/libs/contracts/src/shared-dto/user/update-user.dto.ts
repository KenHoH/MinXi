import { PartialType } from '@nestjs/mapped-types';
import { UserDto } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileUserDto extends PartialType(UserDto) {
  @ApiProperty()
  desc?: string | undefined;
  @ApiProperty()
  profile_picture?: string | undefined;
}

export class UpdateRestriction extends PartialType(UserDto) {
  @ApiProperty()
  content_visibility?: boolean | undefined;
  @ApiProperty()
  liked_visibility?: boolean | undefined;
  @ApiProperty()
  pinned_visibility?: boolean | undefined;
}
