import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
export class GetMessagesDto {
  @ApiProperty({
    description: 'Room ID to get messages from',
    example: 'uuid-123',
  })
  @IsString()
  roomId: string;

  @ApiProperty({
    default: 50,
    minimum: 1,
    maximum: 100,
    description: 'Number of messages to return',
  })
  @IsNumber()
  limit: number = 50;
}
