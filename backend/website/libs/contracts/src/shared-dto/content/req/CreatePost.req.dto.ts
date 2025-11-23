import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsInt()
  creator_id: number;

  @ApiProperty()
  @IsInt()
  area_id: number;

  @ApiProperty()
  @IsString()
  post_type: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  parent_id?: number;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;
}
