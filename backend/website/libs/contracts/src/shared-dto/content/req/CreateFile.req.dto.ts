import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateFileDto {
  @ApiProperty()
  @IsString()
  file_path: string;

  @ApiProperty()
  @IsInt()
  content_id: number;

  @ApiProperty()
  @IsInt()
  area_id: number;

  @ApiProperty()
  @IsString()
  thumbnail: string;
}
