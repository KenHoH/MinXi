import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
export class GetMediaDto {
  @ApiProperty({
    description: 'Room ID to get media from',
    example: 'uuid-123',
  })
  @IsString()
  roomId: string;
}
