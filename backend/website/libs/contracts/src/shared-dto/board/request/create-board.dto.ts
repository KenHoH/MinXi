import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsArray,
  IsInt,
  IsOptional,
} from 'class-validator';

export class CreateBoardDto {
  @ApiProperty()
  @IsString()
  board_thumbnail: string;

  @ApiProperty()
  @IsInt()
  creator_id: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  visibilityPrivate?: boolean;

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
}
