import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class FriendDto {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty()
  @IsInt()
  user_id: number;

  @ApiProperty()
  @IsInt()
  friend_id: number;
}
