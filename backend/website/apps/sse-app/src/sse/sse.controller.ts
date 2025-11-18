import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SseService } from './sse.service';


@Controller()
export class SseController {
  constructor(private readonly sseService: SseService) {}


  @MessagePattern('findAllSse')
  findAll() {
    return this.sseService.findAll();
  }

  @MessagePattern('findOneSse')
  findOne(@Payload() id: number) {
    return this.sseService.findOne(id);
  }


  @MessagePattern('removeSse')
  remove(@Payload() id: number) {
    return this.sseService.remove(id);
  }
}
