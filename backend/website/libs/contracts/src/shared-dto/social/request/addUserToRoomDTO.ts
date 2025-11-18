import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum ParticipantRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}
export class AddUserToRoomDto {
  @ApiProperty({ description: 'Room ID', example: 'uuid-123' })
  @IsString()
  roomId: string;

  @ApiProperty({ description: 'User ID to add', example: 4 })
  @IsNumber()
  userId: number;

  @ApiProperty({
    enum: ParticipantRole,
    required: false,
    default: ParticipantRole.MEMBER,
    description: 'Role for the new participant',
  })
  @IsEnum(ParticipantRole)
  @IsOptional()
  role?: ParticipantRole = ParticipantRole.MEMBER;
}
