import { ApiProperty } from '@nestjs/swagger';
import { MessageResponseDto } from '../../social/response/messageResDTO';
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
}
