import { HttpStatus, ValidationPipeOptions } from '@nestjs/common';

export const PipeValidatorConfig: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
};
