import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
export class RemoveUserFromRoomDto {
  @ApiProperty({ description: 'Room ID', example: 'uuid-123' })
  @IsString()
  roomId: string;

  @ApiProperty({ description: 'User ID to remove', example: 4 })
  @IsNumber()
  userId: number;
}
