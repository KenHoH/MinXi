import { Test, TestingModule } from '@nestjs/testing';
import { UserDatabaseConnection } from './user-database-connection';

describe('UserDatabaseConnection', () => {
  let provider: UserDatabaseConnection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserDatabaseConnection],
    }).compile();

    provider = module.get<UserDatabaseConnection>(UserDatabaseConnection);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
