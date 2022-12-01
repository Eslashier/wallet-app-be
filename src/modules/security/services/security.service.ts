import { Injectable } from '@nestjs/common';
import { ClientService } from '../../../common/services/client.service';
import { ClientCreateDTO } from '../storage/dto/ClientCreate.dto';

@Injectable()
export class SecurityService {
  constructor(private readonly clientService: ClientService) {}

  createNewClient(newClientData: ClientCreateDTO): void {}
}
