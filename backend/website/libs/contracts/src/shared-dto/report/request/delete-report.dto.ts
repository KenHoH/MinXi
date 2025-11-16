import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class DeleteReportDto {
  @ApiProperty()
  @IsInt()
  id: number;
}
