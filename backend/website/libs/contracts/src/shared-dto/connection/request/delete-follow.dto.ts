import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class DeleteFollowDto {
  @ApiProperty()
  @IsInt()
  creator_id: number;

  @ApiProperty()
  @IsInt()
  user_id: number;
}
