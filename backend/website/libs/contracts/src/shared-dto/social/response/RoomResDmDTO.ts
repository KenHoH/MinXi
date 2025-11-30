import { ApiProperty } from '@nestjs/swagger';
import { RoomResponseDto } from './RoomResDTO';
import { UserDto } from '../../user/user.dto';

export class RoomResDmDto extends RoomResponseDto {
  @ApiProperty({
    type: [UserDto],
    description:
      'List of participants (other users in the DM) with their details',
  })
  participants: UserDto[];
}
