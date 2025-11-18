import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum RoomType {
  DIRECT = 'DIRECT',
  GROUP = 'GROUP',
  COMMUNITY = 'COMMUNITY',
}

export class CreateRoomDto {
  @ApiProperty({
    description: 'Array of user IDs to add to the room',
    example: [1, 2, 3],
  })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(100)
  userIds: number[];

  @ApiProperty({ enum: RoomType, description: 'Type of room to create' })
  @IsEnum(RoomType)
  type: RoomType;

  @ApiProperty({
    required: false,
    example: 'My Group Chat',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  ownerId?: number;
}
