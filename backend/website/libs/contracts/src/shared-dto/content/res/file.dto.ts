import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsOptional } from 'class-validator';

export class FileDto {
  @ApiProperty()
  @IsInt()
  file_id: number;

  @ApiProperty()
  @IsString()
  filepath: string;

  @ApiProperty()
  @IsInt()
  content_id: number;

  @ApiProperty()
  @IsInt()
  content_area_id: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  type: string;
}
