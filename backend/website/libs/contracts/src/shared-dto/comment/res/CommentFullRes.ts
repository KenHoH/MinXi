import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';
import { UserDto } from '../../user/user.dto';

export class CommentFullRes {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiProperty()
  @IsInt()
  content_id: number;

  @ApiProperty({ type: UserDto })
  creator: UserDto;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  parent_id?: number;

  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty({ type: [CommentFullRes] })
  @IsArray()
  replies: CommentFullRes[];

  @ApiProperty()
  @IsInt()
  created_at?: Date;
}
