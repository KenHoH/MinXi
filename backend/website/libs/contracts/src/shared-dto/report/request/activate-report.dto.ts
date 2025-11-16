import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class ActivateReportDto {
  @ApiProperty()
  @IsInt()
  id: number;
}
