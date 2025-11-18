import { Test, TestingModule } from '@nestjs/testing';
import { MessageDatabaseConnection } from './message-database-connection';

describe('MessageDatabaseConnection', () => {
  let provider: MessageDatabaseConnection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageDatabaseConnection],
    }).compile();

    provider = module.get<MessageDatabaseConnection>(MessageDatabaseConnection);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
