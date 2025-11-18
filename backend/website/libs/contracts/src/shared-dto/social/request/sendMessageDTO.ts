import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
export class SendMessageDto {
  @ApiProperty({
    description: 'Room ID where message will be sent',
    example: 'uuid-123',
  })
  @IsString()
  roomId: string;

  @ApiProperty({ description: 'Message content', example: 'Hello everyone!' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Author user ID', example: 1 })
  @IsNumber()
  authorId: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  mediaUrl?: string;
}
