import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../user/user.dto';
import { IsNumber } from 'class-validator';
export class GroupCommunitiesResponseDto {
  @ApiProperty({ description: 'GroupComm ID', example: 'msg-uuid' })
  id: string;

  @ApiProperty({ description: 'Group ID', example: 'group-uuid' })
  groupId: string;

  @ApiProperty({ description: 'Community ID', example: 'community-uuid' })
  communityId: string;

  @ApiProperty({
    required: false,
    description: 'Room name',
    example: 'My Group Chat',
  })
  name?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty()
  pictureUrl: string;

  @ApiProperty()
  @IsNumber()
  participantCount: number;
}
