import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class DeactivateReportDto {
  @ApiProperty()
  @IsInt()
  id: number;
}
