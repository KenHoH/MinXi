import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class FollowingDto {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty()
  @IsInt()
  creator_id: number;

  @ApiProperty()
  @IsInt()
  follower_id: number;
}
