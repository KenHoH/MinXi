import { Test, TestingModule } from '@nestjs/testing';
import { WebsiteApiGatewayController } from './website-api-gateway.controller';
import { WebsiteApiGatewayService } from './website-api-gateway.service';

describe('WebsiteApiGatewayController', () => {
  let websiteApiGatewayController: WebsiteApiGatewayController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WebsiteApiGatewayController],
      providers: [WebsiteApiGatewayService],
    }).compile();

    websiteApiGatewayController = app.get<WebsiteApiGatewayController>(WebsiteApiGatewayController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(websiteApiGatewayController.getHello()).toBe('Hello World!');
    });
  });
});
