import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
export class ParticipantTotalResDTO {
  @ApiProperty()
  @IsNumber()
  totalParticipants: number;

  @ApiProperty()
  @IsString()
  roomId: string;
}
