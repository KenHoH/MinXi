import { Injectable } from '@nestjs/common';

@Injectable()
export class SseService {
  findAll() {
    return `This action returns all sse`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sse`;
  }

  remove(id: number) {
    return `This action removes a #${id} sse`;
  }
}
