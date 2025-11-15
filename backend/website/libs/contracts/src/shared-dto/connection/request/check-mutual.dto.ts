import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CheckMutualDto {
  @ApiProperty()
  @IsInt()
  user_id: number;

  @ApiProperty()
  @IsInt()
  friend_id: number;
}
