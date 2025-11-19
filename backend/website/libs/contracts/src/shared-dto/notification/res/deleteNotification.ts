import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class DeleteNotificationRes {
  @ApiProperty()
  @IsInt()
  id: number;
}
