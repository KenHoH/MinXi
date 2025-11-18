import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ParticipantRole } from '../request/addUserToRoomDTO';
export class ParticipantResponseDto {
  @ApiProperty({
    description: 'Participant ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({ description: 'User ID', example: 1 })
  userId: number;

  @ApiProperty({
    description: 'Room ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  roomId: string;

  @ApiProperty({
    enum: ParticipantRole,
    description: 'Participant role in the room',
  })
  role: ParticipantRole;
}
