import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { RoomType } from '../request/createRoomDTO';
export class RoomResponseDto {
  @ApiProperty({ description: 'Room ID', example: 'room-uuid' })
  id: string;

  @ApiProperty({
    required: false,
    description: 'Room name',
    example: 'My Group Chat',
  })
  name?: string;

  @ApiProperty({ enum: RoomType, description: 'Room type' })
  type: RoomType;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
