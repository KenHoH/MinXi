import { ApiProperty } from '@nestjs/swagger';

export class LogoutRequest {
  @ApiProperty()
  id: number;
  @ApiProperty()
  refreshToken: string;
}
