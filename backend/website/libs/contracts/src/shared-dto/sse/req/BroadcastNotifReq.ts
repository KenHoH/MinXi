import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class BroadcastNotifReq {
  @ApiProperty()
  @IsInt()
  userId: number;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  sendId?: number;

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
