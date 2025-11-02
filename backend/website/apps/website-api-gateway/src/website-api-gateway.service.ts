import { Injectable } from '@nestjs/common';

@Injectable()
export class WebsiteApiGatewayService {
  getHello(): string {
    return 'Hello World!';
  }
}
