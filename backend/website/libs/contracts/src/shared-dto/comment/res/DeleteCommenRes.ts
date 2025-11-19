import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class DeleteCommentRes {
  @ApiProperty()
  @IsInt()
  id: number;
}
