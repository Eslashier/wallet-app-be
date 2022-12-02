import { Module } from '@nestjs/common';
import { AppController } from './modules/main/controllers/app.controller';
import { AppService } from './modules/main/services/app.service';
import { ConfigModule } from '@nestjs/config';
import { getEnvPath } from './common/helper/env.helper';
import { CommonModule } from './common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/database/postgresql.config';
import { join } from 'path';

const envFilePath = getEnvPath(join(process.cwd(), 'envs'));
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
