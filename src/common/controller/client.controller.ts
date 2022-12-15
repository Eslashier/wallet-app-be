import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TokenVerificationGuard } from '../../../src/modules/security/guards/token-verification.guard';
import { AccountIdInterceptor } from '../interceptor/accountId.interceptor';
import { ClientService } from '../services/client.service';
import { ClientEntity } from '../storage/databases/postgresql/entities/client.entity';
import { CreateClientDto } from '../storage/dto/client/create-client.dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  // @Get()
  // async getClients(): Promise<ClientEntity[]> {
  //   return this.clientService.getAll();
  // }

  @Post()
  async createClient(@Body() client: CreateClientDto): Promise<ClientEntity> {
    const newCLient = new ClientEntity(client);
    return this.clientService.createClient(newCLient);
  }

  @UseInterceptors(AccountIdInterceptor)
  @Get('/account/:clientInfo')
  @UseGuards(TokenVerificationGuard)
  async findClientAccount(
    @Param('clientInfo') clientInfo: string,
  ): Promise<ClientEntity> {
    return this.clientService.findClientAccount(clientInfo);
  }

  @Get('/:email')
  @UseGuards(TokenVerificationGuard)
  async findClient(@Param('email') email: string): Promise<ClientEntity> {
    return this.clientService.findClient(email);
  }

  @Get('/account-exist/:info')
  @UseGuards(TokenVerificationGuard)
  async accountExist(@Param('info') info: string): Promise<boolean> {
    return this.clientService.accountExist(info);
  }

  @Get('/is-registered/:email')
  async isRegisteredClient(@Param('email') email: string): Promise<boolean> {
    return this.clientService.isRegisteredClient(email);
  }
}
