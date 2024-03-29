import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getEnvPath } from './common/helper/env.helper';
import { CommonModule } from './common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/database/postgresql.config';
import { join } from 'path';
import { QueryFailedErrorExceptionFilter } from './common/exceptionFilters/query-failed-error.exception-filter';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

const envFilePath = getEnvPath(join(process.cwd(), 'envs'));
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   debug: false,
    //   playground: true,
    //   autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    // }),
    CommonModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_FILTER, useClass: QueryFailedErrorExceptionFilter },
  ],
})
export class AppModule {}
