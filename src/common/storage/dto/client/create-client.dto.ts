import {
  IsEmail,
  IsInt,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateClientDto {
  @IsString({
    message: 'fullName should be a string',
  })
  @Length(10, 500, {
    message: 'fullName min length is 10 max length is 500 characters',
  })
  fullName: string;
  @IsEmail({
    message: 'Should be a valid email',
  })
  @Length(10, 500, {
    message: 'email max length is 500 characters',
  })
  email: string;
  @IsInt({
    message: 'Should be a valid email',
  })
  @Min(3000000000)
  @Max(4000000000)
  phone: string;
  @IsString({
    message: 'Should be a valid email',
  })
  @Length(10, 500, {
    message: 'email max length is 500 characters',
  })
  photo: string;
}
