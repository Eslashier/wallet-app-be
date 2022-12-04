import { TokenVerificationGuard } from './token-verification.guard';

describe('TokenVerificationGuard', () => {
  it('should be defined', () => {
    expect(new TokenVerificationGuard()).toBeDefined();
  });
});
