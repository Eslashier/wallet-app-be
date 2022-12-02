import { Body, Controller, Get, Post } from '@nestjs/common';
import { get } from 'http';
import { ClientService } from '../services/client.service';
import { ClientEntity } from '../storage/databases/postgresql/entities/client.entity';
import { CreateClientDto } from '../storage/dto/client/create-client.dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  async getClients(): Promise<string> {
    return this.clientService.getAll();
  }

  @Post()
  async createClient(@Body() client: CreateClientDto): Promise<ClientEntity> {
    const newCLient = new ClientEntity(client);
    return this.clientService.createClient(client);
  }
}
