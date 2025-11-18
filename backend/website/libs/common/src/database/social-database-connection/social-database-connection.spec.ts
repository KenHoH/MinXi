import { Test, TestingModule } from '@nestjs/testing';
import { SocialDatabaseConnection } from './social-database-connection';

describe('SocialDatabaseConnection', () => {
  let provider: SocialDatabaseConnection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocialDatabaseConnection],
    }).compile();

    provider = module.get<SocialDatabaseConnection>(SocialDatabaseConnection);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
