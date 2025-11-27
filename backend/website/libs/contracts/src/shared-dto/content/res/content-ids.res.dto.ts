import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt } from 'class-validator';

export class ContentIdsResDto {
  @ApiProperty()
  Valid: boolean;

  @ApiProperty()
  Msg: string;

  @ApiProperty({ type: [Number] })
  @IsArray()
  @IsInt({ each: true })
  data: number[];
}
