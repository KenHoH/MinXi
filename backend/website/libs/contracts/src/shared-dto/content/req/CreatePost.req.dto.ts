import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsOptional, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';
import { FileDto } from '../res/file.dto';

export class CreatePostDto {
  @ApiProperty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  creator_id: number;

  @ApiProperty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  area_id: number;

  @ApiProperty()
  @IsString()
  post_type: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  @IsInt()
  parent_id?: number;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  thumbnail: string;

  @ApiProperty({ type: [FileDto], isArray: true })
  @IsArray()
  contents: FileDto[];

  @ApiProperty()
  @IsString()
  published_at: string;
}
