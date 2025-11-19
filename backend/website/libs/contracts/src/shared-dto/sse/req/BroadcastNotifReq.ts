import { ApiProperty } from '@nestjs/swagger';
import { MessageResponseDto } from '../../social/response/messageResDTO';
import { IsBoolean, IsInt, IsString } from 'class-validator';

export class BroadcastNotifReq {
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
}
