// used as a response for the sse service

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
export class MessageResponseDto {
  @ApiProperty({ description: 'Message ID', example: 'msg-uuid' })
  id: string;

  @ApiProperty({ description: 'Room ID', example: 'room-uuid' })
  roomId: string;

  @ApiProperty({ description: 'Message content', example: 'Hello!' })
  content: string;

  @ApiProperty({ description: 'Type metadata', example: 'TEXT' })
  type: string;

  @ApiProperty({
    required: false,
    description: 'Media URL',
    example: 'https://example.com/image.jpg',
  })
  mediaUrl?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({ description: 'Author user ID', example: 1 })
  authorId: number;

  @ApiProperty({ description: 'Author name', example: 'John Doe' })
  authorName?: string;
  @ApiProperty({
    description: 'Author profile URL',
    example: 'https://example.com/profile.jpg',
  })
  authorProfileUrl?: string;
}
