import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsString } from 'class-validator';

export class NotificationReq {
  @ApiProperty()
  @IsInt()
  userId: number;

  @ApiProperty()
  @IsBoolean()
  isSeen: boolean;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  type: string;
}
