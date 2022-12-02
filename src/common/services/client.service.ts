import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientEntity } from '../storage/databases/postgresql/entities/client.entity';
import { CreateClientDto } from '../storage/dto/client/create-client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
  ) {}

  // async getAll(): Promise<ClientEntity[]> {
  //   const clients = await this.clientRepository.find({
  //     relations: {
  //       app: true,
  //       account: true,
  //     },
  //   });
  //   if (clients.length === 0) {
  //     throw new NotFoundException('there is no clients to show');
  //   }
  //   return clients;
  // }

  async getAll(): Promise<string> {
    const clients = await this.clientRepository.find({});
    return clients[0].app.id;
  }

  async createClient(client: CreateClientDto): Promise<ClientEntity> {
    const newClient = this.clientRepository.create(client);
    await this.clientRepository.save(newClient);
    return newClient;
  }
}
