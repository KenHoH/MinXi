import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class GetByIdDto {
  @ApiProperty()
  @IsInt()
  id: number;
}
