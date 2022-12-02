import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.get<ConfigService>(ConfigService);
  app.setGlobalPrefix('api/v1');
  await app.listen(3000);
}
bootstrap();
