import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
export class FindDmDto {
  @ApiProperty({ description: 'Target user ID to find DM with', example: 2 })
  @IsNumber()
  userId: number;
  @ApiProperty({ description: 'Target user ID to find DM with', example: 2 })
  @IsNumber()
  targetUserId: number;
}
