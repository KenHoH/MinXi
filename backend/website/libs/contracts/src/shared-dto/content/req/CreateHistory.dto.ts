import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt } from 'class-validator';

export class CreateHistoryDto {
  @ApiProperty()
  @IsInt()
  user_id: number;

  @ApiProperty()
  @IsInt()
  content_id: number;

  @ApiProperty()
  @IsInt()
  reps: number;

  @ApiProperty()
  @IsBoolean()
  liked: boolean;

  @ApiProperty()
  @IsBoolean()
  pinned: boolean;
}
