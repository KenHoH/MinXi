import { Module } from '@nestjs/common';
import { SocialModule } from './social/social.module';


@Module({
  imports: [SocialModule],
  controllers: [],
  providers: [],
})
export class SocialAppModule {}
