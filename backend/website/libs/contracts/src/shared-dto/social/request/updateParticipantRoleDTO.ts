import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ParticipantRole } from './addUserToRoomDTO';

export class UpdateParticipantRoleDto {
  @ApiProperty({ description: 'Room ID', example: 'uuid-123' })
  @IsString()
  roomId: string;

  @ApiProperty({ description: 'User ID to update', example: 4 })
  @IsNumber()
  userId: number;

  @ApiProperty({
    enum: ParticipantRole,
    description: 'New role for the participant',
  })
  @IsEnum(ParticipantRole)
  newRole: ParticipantRole;
}
