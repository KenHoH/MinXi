import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class FindFYPDto {
  @ApiProperty()
  @IsInt()
  userId: number;

  @ApiProperty()
  @IsInt()
  areaId: number;
}
