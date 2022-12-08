import { IsInt, IsUUID, Length, Min } from 'class-validator';

export class CreateMovementDto {
  @IsUUID()
  incomeAccountId: string;
  @IsUUID()
  outcomeAccountId: string;
  @Length(5, 500, {
    message: 'message min length is 5 max length is 500 characters',
  })
  reason: string;
  @IsInt({
    message: 'Should be a number',
  })
  @Min(50, { message: 'min amount to send is 50' })
  amount: string;
  @IsInt({
    message: 'Fees should be a valid number, greater than or equal to 0',
  })
  @Min(0, { message: 'minimum fee value is 0' })
  fees: number;
}
