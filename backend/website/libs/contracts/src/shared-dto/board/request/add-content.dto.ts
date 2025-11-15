import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class AddContentDto {
  @ApiProperty()
  @IsInt()
  content_id: number;
}
