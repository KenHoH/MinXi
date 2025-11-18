import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { RoomType } from './createRoomDTO';
export class GetAllRoomsDto {
  @ApiProperty({ description: 'User ID to get rooms for', example: 1 })
  @IsNumber()
  userId: number;
}
