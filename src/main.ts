import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PipeValidatorConfig } from './modules/configs/pipe-validator.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.get<ConfigService>(ConfigService);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe(PipeValidatorConfig));
  await app.listen(3000);
}
bootstrap();
