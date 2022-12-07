import { IsString, Length } from 'class-validator';

export class UpdateAppReceiverDto {
  @IsString({ message: 'Color should be a string' })
  @Length(0, 30, {
    message: 'color max length is 30 characters',
  })
  color: string;
}
