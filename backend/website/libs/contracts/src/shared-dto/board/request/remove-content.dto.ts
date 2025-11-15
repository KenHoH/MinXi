import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class RemoveContentDto {
  @ApiProperty()
  @IsInt()
  content_id: number;
}
