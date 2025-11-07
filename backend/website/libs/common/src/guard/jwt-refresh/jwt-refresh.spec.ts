import { Test, TestingModule } from '@nestjs/testing';
import { JwtRefresh } from './jwt-refresh';

describe('JwtRefresh', () => {
  let provider: JwtRefresh;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtRefresh],
    }).compile();

    provider = module.get<JwtRefresh>(JwtRefresh);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
