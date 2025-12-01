import { Controller, Get } from '@nestjs/common';
import { Public } from '@app/common/decorators/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get()
  health(): { status: string; message: string } {
    return {
      status: 'ok',
      message: 'API Gateway is running',
    };
  }

  @Public()
  @Get('health')
  healthCheck(): { status: string; timestamp: string } {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    };
  }
}
