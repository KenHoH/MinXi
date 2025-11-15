import { Module } from '@nestjs/common';
import { HistoryModule } from './history/history.module';

@Module({
  imports: [HistoryModule],
  controllers: [],
  providers: [],
})
export class HistoryAppModule {}
