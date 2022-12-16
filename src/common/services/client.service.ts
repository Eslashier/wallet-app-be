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

  async getAll(): Promise<ClientEntity[]> {
    const clients = await this.clientRepository.find({
      relations: {
        app: true,
        account: true,
      },
    });
    if (clients.length === 0) {
      throw new NotFoundException('there is no clients to show');
    }
    return clients;
  }

  async createClient(client: ClientEntity): Promise<ClientEntity> {
    const newClient = this.clientRepository.create(client);
    await this.clientRepository.save(newClient);
    return newClient;
  }

  async findClientAccount(clientInfo: string): Promise<ClientEntity> {
    try {
      const clientFound = await this.clientRepository.findOneOrFail({
        where: [
          {
            email: clientInfo,
          },
          {
            phone: clientInfo,
          },
        ],
        relations: {
          app: true,
          account: true,
        },
      });
      return clientFound;
    } catch (err) {
      throw new NotFoundException(
        `The client with the info : ${clientInfo} has been not found`,
      );
    }
  }

  async accountExist(clientInfo: string): Promise<boolean> {
    try {
      await this.clientRepository.findOneOrFail({
        where: [
          {
            email: clientInfo,
          },
          {
            phone: clientInfo,
          },
        ],
      });
      return true;
    } catch (err) {
      return false;
    }
  }

  async isRegisteredClient(clientEmail: string): Promise<boolean> {
    try {
      await this.clientRepository.findOneOrFail({
        where: {
          email: clientEmail,
        },
      });
      return true;
    } catch (err) {
      return false;
    }
  }

  async findClient(clientInfo: string): Promise<ClientEntity> {
    try {
      const clientByEmail = await this.clientRepository.findOneOrFail({
        where: {
          email: clientInfo,
        },
        relations: {
          app: true,
          account: true,
        },
      });
      return clientByEmail;
    } catch (error) {
      throw new NotFoundException(
        `The client with the email : ${clientInfo} has been not found`,
      );
    }
  }
}
