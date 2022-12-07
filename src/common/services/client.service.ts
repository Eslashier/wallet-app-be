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
    const clientByEmail = await this.clientRepository.findOne({
      where: {
        email: clientInfo,
      },
      relations: {
        app: true,
        account: true,
      },
    });
    const clientByPhone = await this.clientRepository.findOne({
      where: {
        phone: clientInfo,
      },
      relations: {
        app: true,
        account: true,
      },
    });
    if (clientByEmail) {
      return clientByEmail;
    } else if (clientByPhone) {
      return clientByPhone;
    } else {
      throw new NotFoundException(
        `The client with the info : ${clientInfo} has been not found`,
      );
    }
  }

  async isRegisteredClient(clientEmail: string): Promise<boolean> {
    const foundClient = await this.clientRepository.findOne({
      where: {
        email: clientEmail,
      },
      relations: {
        app: true,
        account: true,
      },
    });
    return foundClient ? true : false;
  }

  async findClient(clientInfo: string): Promise<ClientEntity> {
    const clientByEmail = await this.clientRepository.findOne({
      where: {
        email: clientInfo,
      },
      relations: {
        app: true,
        account: true,
      },
    });
    if (clientByEmail) {
      // console.log(clientByEmail);
      return clientByEmail;
    } else {
      throw new NotFoundException(
        `The client with the email : ${clientInfo} has been not found`,
      );
    }
  }
}
