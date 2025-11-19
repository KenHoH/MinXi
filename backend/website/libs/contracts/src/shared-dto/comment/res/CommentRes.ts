import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

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
  @IsString()
  text: string;

  @ApiProperty()
  @IsInt()
  created_at?: Date;
}
