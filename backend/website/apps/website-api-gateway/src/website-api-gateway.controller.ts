import { Controller, Get } from '@nestjs/common';
import { WebsiteApiGatewayService } from './website-api-gateway.service';

@Controller()
export class WebsiteApiGatewayController {
  constructor(private readonly websiteApiGatewayService: WebsiteApiGatewayService) {}

  @Get()
  getHello(): string {
    return this.websiteApiGatewayService.getHello();
  }
}
