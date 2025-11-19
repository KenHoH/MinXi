import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ConnectionStatsRes {
  @ApiProperty()
  @IsNumber()
  totalRooms: number;

  @ApiProperty()
  @IsString({ each: true })
  rooms: string[];
}
