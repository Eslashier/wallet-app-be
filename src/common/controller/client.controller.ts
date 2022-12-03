import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
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

  // @Get()
  // async getClients(): Promise<string> {
  //   return this.clientService.getAll();
  // }

  @Post()
  async createClient(@Body() client: CreateClientDto): Promise<ClientEntity> {
    const newCLient = new ClientEntity(client);
    return this.clientService.createClient(newCLient);
  }

  @UseInterceptors(AccountIdInterceptor)
  @Get('/:clientInfo')
  async getClientByInfo(
    @Param('clientInfo') clientInfo: string,
  ): Promise<ClientEntity> {
    return this.clientService.findClientAccount(clientInfo);
  }
}
