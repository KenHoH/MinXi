import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class CommentRes {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiProperty()
  @IsInt()
  content_id: number;

  @ApiProperty()
  @IsInt()
  creator_id: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  parent_id?: number;

  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty({ type: [CommentRes] })
  @IsArray()
  replies: CommentRes[];

  @ApiProperty()
  @IsInt()
  created_at?: Date;
}
