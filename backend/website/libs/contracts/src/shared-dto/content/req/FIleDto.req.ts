import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsOptional } from 'class-validator';

export class FileDtoReq {
  @ApiProperty()
  @IsString()
  filepath: string;

  @ApiProperty()
  @IsInt()
  content_area_id: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  type: string;
}
