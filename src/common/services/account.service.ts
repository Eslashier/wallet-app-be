import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from '../storage/databases/postgresql/entities/account.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  async getAll(): Promise<AccountEntity[]> {
    const accounts = await this.accountRepository.find({
      relations: {
        incomes: true,
        outcomes: true,
      },
    });
    if (accounts.length === 0) {
      throw new NotFoundException('there is no accounts to show');
    }
    return accounts;
  }
}
