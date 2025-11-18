import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
export class GetAllDmDto {
  @ApiProperty({ description: 'User ID to get DMs for', example: 1 })
  @IsNumber()
  userId: number;

  @ApiProperty({
    required: false,
    default: 50,
    description: 'Number of DMs to return',
  })
  @IsNumber()
  @IsOptional()
  limit?: number = 50;
}
