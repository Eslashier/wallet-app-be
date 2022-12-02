import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AccountEntity } from '../../common/storage/databases/postgresql/entities/account.entity';
import { AppEntity } from '../../common/storage/databases/postgresql/entities/app.entity';
import { ClientEntity } from '../../common/storage/databases/postgresql/entities/client.entity';
import { MovementEntity } from '../../common/storage/databases/postgresql/entities/movement.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      name: '',
      host: this.config.get<string>('DATABASE_HOST'),
      port: this.config.get<number>('DATABASE_PORT'),
      username: this.config.get<string>('DATABASE_USER'),
      password: this.config.get<string>('DATABASE_PASSWORD'),
      database: '',
      synchronize: false,
      entities: [AccountEntity, AppEntity, ClientEntity, MovementEntity],
    };
  }
}
