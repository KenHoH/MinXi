import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateScoreItemDto {
  @ApiProperty({ description: 'Content ID' })
  @IsInt()
  content_id: number;

  @ApiProperty({ description: 'Area ID (1-3)' })
  @IsInt()
  area_id: number;

  @ApiProperty({ description: 'Score value' })
  @IsNumber()
  score: number;
}

export class UpdateScoreDto {
  @ApiProperty({
    description: 'Array of content scores to update',
    type: [UpdateScoreItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateScoreItemDto)
  scores: UpdateScoreItemDto[];
}
