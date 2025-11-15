import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CheckFollowDto {
  @ApiProperty()
  @IsInt()
  creator_id: number;

  @ApiProperty()
  @IsInt()
  follower_id: number;
}
