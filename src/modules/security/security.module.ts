import { Module } from '@nestjs/common';
import { SecurityController } from './controllers/security.controller';
import { SecurityService } from './services/security.service';

@Module({
  controllers: [SecurityController],
  providers: [SecurityService],
})
export class SecurityModule {}
