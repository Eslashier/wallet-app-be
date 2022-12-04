import { Module } from '@nestjs/common';
import { AccountController } from './controller/account.controller';
import { AppController } from './controller/app.controller';
import { ClientController } from './controller/client.controller';
import { MovementController } from './controller/movement.controller';
import { AccountService } from './services/account.service';
import { AppService } from './services/app.service';
import { ClientService } from './services/client.service';
import { MovementService } from './services/movement.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './storage/databases/postgresql/entities/account.entity';
import { ClientEntity } from './storage/databases/postgresql/entities/client.entity';
import { AppEntity } from './storage/databases/postgresql/entities/app.entity';
import { MovementEntity } from './storage/databases/postgresql/entities/movement.entity';
import { TokenVerificationGuard } from 'src/modules/security/guards/token-verification.guard';
import { SecurityModule } from 'src/modules/security/security.module';

@Module({
  controllers: [
    ClientController,
    AccountController,
    AppController,
    MovementController,
  ],
  providers: [ClientService, AccountService, AppService, MovementService],
  imports: [
    TypeOrmModule.forFeature([
      ClientEntity,
      AccountEntity,
      AppEntity,
      MovementEntity,
    ]),
    SecurityModule,
  ],
})
export class CommonModule {}
