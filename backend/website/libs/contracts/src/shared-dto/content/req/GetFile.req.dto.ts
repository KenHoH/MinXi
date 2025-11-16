import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class GetFileDto {
  @ApiProperty()
  @IsInt()
  contentId: number;

  @ApiProperty()
  @IsInt()
  areaId: number;
}
