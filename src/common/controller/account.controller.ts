import { Controller, Get } from '@nestjs/common';
import { AccountService } from '../services/account.service';
import { AccountEntity } from '../storage/databases/postgresql/entities/account.entity';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  // @Get()
  // async getClients(): Promise<AccountEntity[]> {
  //   return this.accountService.getAll();
  // }
}
