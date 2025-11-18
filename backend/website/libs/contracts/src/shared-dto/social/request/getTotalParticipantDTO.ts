import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
export class GetTotalParticipantsDto {
  @ApiProperty({
    description: 'Room ID to get participant count for',
    example: 'uuid-123',
  })
  @IsString()
  roomId: string;
}
