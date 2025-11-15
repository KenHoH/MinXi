import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsArray, IsInt, IsDate } from 'class-validator';

export class BoardDto {
  @ApiProperty()
  @IsInt()
  board_id: number;

  @ApiProperty()
  @IsString()
  board_thumbnail: string;

  @ApiProperty()
  @IsInt()
  creator_id: number;

  @ApiProperty()
  @IsBoolean()
  visibilityPrivate: boolean;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ type: [Number] })
  @IsArray()
  @IsInt({ each: true })
  contents: number[];

  @ApiProperty()
  @IsDate()
  created_at: Date;

  @ApiProperty()
  @IsDate()
  updated_at: Date;
}
