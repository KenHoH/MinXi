import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SseService } from './sse.service';

@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Get()
  findAll() {
    return this.sseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sseService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sseService.remove(+id);
  }
}
