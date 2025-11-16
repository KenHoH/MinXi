import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsEnum } from 'class-validator';

enum ReportType {
  ABUSE = 'Abuse',
  SPAM = 'Spam',
  MISSINFORMATION = 'Missinformation',
}

export class CreateReportDto {
  @ApiProperty()
  @IsInt()
  creator_id: number;

  @ApiProperty()
  @IsInt()
  userId: number;

  @ApiProperty()
  @IsString()
  desc: string;

  @ApiProperty({ enum: ReportType })
  @IsEnum(ReportType, {
    message: 'Type must be one of: Abuse, Spam, Missinformation',
  })
  type: string;
}
