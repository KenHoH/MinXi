import { Test, TestingModule } from '@nestjs/testing';
import { ContentDatabaseConnection } from './content-database-connection';

describe('ContentDatabaseConnection', () => {
  let provider: ContentDatabaseConnection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentDatabaseConnection],
    }).compile();

    provider = module.get<ContentDatabaseConnection>(ContentDatabaseConnection);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
