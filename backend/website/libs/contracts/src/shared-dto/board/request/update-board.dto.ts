import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsArray,
  IsInt,
  IsOptional,
} from 'class-validator';

export class UpdateBoardDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  board_thumbnail?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  visibilityPrivate?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: [Number], required: false })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  contents?: number[];
}
