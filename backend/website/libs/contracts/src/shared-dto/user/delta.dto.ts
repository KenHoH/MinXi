import { ApiProperty } from '@nestjs/swagger';

export class deltaDto {
  @ApiProperty()
  delta: number;
}
