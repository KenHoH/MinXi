// req for sse service

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class BroadcastMsgReq {
  @ApiProperty()
  @IsString()
  roomId: string;

  @ApiProperty()
  @ApiProperty({ description: 'Message ID', example: 'msg-uuid' })
  id: string;

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
