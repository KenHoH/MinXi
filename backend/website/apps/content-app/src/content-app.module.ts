import { Module } from '@nestjs/common';
import { ContentModule } from './content/content.module';
import { ContentModule } from './content/content.module';

@Module({
  imports: [ContentModule],
  controllers: [],
  providers: [],
})
export class ContentAppModule {}
