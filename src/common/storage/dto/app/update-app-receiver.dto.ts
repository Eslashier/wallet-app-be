import { IsString, Length } from 'class-validator';

export class UpdateAppReceiverDto {
  @IsString({ message: 'Color should be a string' })
  @Length(0, 30, {
    message: 'fullName min length is 10 max length is 500 characters',
  })
  color: string;
}
