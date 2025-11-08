import { Injectable } from '@nestjs/common';

@Injectable()
export class ContentService {

  findAll() {
    return `This action returns all content`;
  }

  findOne(id: number) {
    return `This action returns a #${id} content`;
  }


  remove(id: number) {
    return `This action removes a #${id} content`;
  }
}
