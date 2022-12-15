import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TokenVerificationGuard } from '../../../src/modules/security/guards/token-verification.guard';
import { AccountService } from '../services/account.service';
import { AccountEntity } from '../storage/databases/postgresql/entities/account.entity';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  // @Get()
  // async getClients(): Promise<AccountEntity[]> {
  //   return this.accountService.getAll();
  // }

  @Get()
  @UseGuards(TokenVerificationGuard)
  async getClient(@Param('id') id: string): Promise<AccountEntity> {
    return this.accountService.getAccount(id);
  }
}
