import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { Repository } from './repository/repository';
import { CommonModule } from '@app/common';

@Module({
  imports: [CommonModule],
  controllers: [LogController],
  providers: [LogService, Repository],
})
export class LogModule {}
