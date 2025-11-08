import { ApiOperation, ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  area_id: number;
}
