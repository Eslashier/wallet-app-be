import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from '../storage/databases/postgresql/entities/account.entity';
import { UpdateAccountDto } from '../storage/dto/account/update-account.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  // async getAll(): Promise<AccountEntity[]> {
  //   const accounts = await this.accountRepository.find({
  //     relations: {
  //       incomes: true,
  //       outcomes: true,
  //     },
  //   });
  //   if (accounts.length === 0) {
  //     throw new NotFoundException('there is no accounts to show');
  //   }
  //   return accounts;
  // }

  async getAccount(id: string): Promise<AccountEntity> {
    try {
      const account = await this.accountRepository.findOneOrFail({
        where: {
          id: id,
        },
      });
      return account;
    } catch (err) {
      throw new NotFoundException(
        `Account with the id: ${id} no accounts to show`,
      );
    }
  }

  async updateAccount(
    id: string,
    updatedAccount: UpdateAccountDto,
  ): Promise<boolean> {
    try {
      const account = await this.getAccount(id);
      if (Number(account.balance) >= Number(-updatedAccount.balance))
        account.balance = (
          Number(account.balance) + Number(updatedAccount?.balance)
        ).toString();
      else {
        throw new BadRequestException(
          'The amount cannot be greater than the balance',
        );
      }

      if (updatedAccount.credit) {
        if (Number(account.credit) >= Number(-updatedAccount.credit)) {
          account.credit = (
            Number(account.credit) + Number(updatedAccount?.credit)
          ).toString();
        } else {
          throw new BadRequestException(
            'The amount to loan cannot be greater than the credit',
          );
        }
      }

      account.updatedDate = updatedAccount.updatedDate;

      await this.accountRepository.update({ id }, account);

      return true;
    } catch (error) {
      throw new UnprocessableEntityException(error.response.message);
    }
  }
}
