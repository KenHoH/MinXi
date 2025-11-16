import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsBoolean, IsDate } from 'class-validator';

export class ReportDto {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty()
  @IsInt()
  creatorId: number;

  @ApiProperty()
  @IsInt()
  userId: number;

  @ApiProperty()
  @IsString()
  desc: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty()
  @IsDate()
  createdAt: Date;
}
