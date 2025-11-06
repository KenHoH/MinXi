import { Module } from '@nestjs/common';
import { ContractsService } from './contracts.service';

@Module({
  providers: [ContractsService],
  exports: [ContractsService],
  imports: [],
})
export class ContractsModule {}
