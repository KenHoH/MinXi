import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../user/user.dto';
import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class UserRoleDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  user_id: number;

  @ApiProperty({ type: String })
  @IsString()
  username: string;

  @ApiProperty({ type: String })
  @IsString()
  desc: string;

  @ApiProperty({ type: String })
  @IsString()
  profile_picture: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  follower: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  total_like: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  total_reports: number;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  content_visibilityPrivate: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  pinned_visibilityPrivate: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  liked_visibilityPrivate: boolean;

  @ApiProperty({ type: Number })
  @IsNumber()
  area_id: number;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  liked_notification_disabled: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  comments_notification_disabled: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  followers_notification_disabled: boolean;

  @ApiProperty({ type: String })
  @IsString()
  role: string;
}
