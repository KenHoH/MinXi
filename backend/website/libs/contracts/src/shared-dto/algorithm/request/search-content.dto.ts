import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SearchContentDto {
  @ApiProperty()
  @IsString()
  query: string;
}
