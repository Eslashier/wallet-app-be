import { Module } from '@nestjs/common';
import { TokenVerificationGuard } from './guards/token-verification.guard';

@Module({
  controllers: [],
  providers: [TokenVerificationGuard],
  exports: [TokenVerificationGuard],
})
export class SecurityModule {}
