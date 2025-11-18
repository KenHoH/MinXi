import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetRoomInfoDto {
  @ApiProperty({ description: 'Room ID', example: 'uuid-123' })
  @IsString()
  roomId: string;
}
