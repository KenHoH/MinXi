import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class GroupFromCommunitiesDto {
  @ApiProperty({ description: 'Communities ID', example: 'uuid-123' })
  @IsString()
  communitiesId: string;

  @ApiProperty({ description: 'group ID to remove' })
  @IsString()
  groupId: string;
}
