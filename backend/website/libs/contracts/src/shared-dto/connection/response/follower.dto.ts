import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsDate } from 'class-validator';

export class FollowerDto {
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
