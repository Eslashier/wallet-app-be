import { IsNumber } from 'class-validator';

export class AccountDto {
  @IsNumber()
  balance: number;
  credit: number;
  state: number;
  updatedAt: Date;
}
