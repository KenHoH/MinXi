import { Test, TestingModule } from '@nestjs/testing';
import { LogDatabaseConnection } from './log-database-connection';

describe('LogDatabaseConnection', () => {
  let provider: LogDatabaseConnection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogDatabaseConnection],
    }).compile();

    provider = module.get<LogDatabaseConnection>(LogDatabaseConnection);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
