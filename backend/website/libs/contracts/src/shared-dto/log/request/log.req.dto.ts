import { ApiProperty } from '@nestjs/swagger';

export class LogReq {
  @ApiProperty()
  method: string;
  @ApiProperty()
  path: string;
  @ApiProperty()
  meta?: any;
}
