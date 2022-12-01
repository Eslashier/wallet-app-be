import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './modules/main/controllers/app.controller';
import { AppService } from './modules/main/services/app.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    TypeOrmModule.forRoot({
      name: 'default',
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'notanadmin',
      database: '',
      synchronize: false,
      entities: ['entities/*.js'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
