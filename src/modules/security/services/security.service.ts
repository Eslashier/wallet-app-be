import { Injectable } from '@nestjs/common';
import { ClientCreateDTO } from 'src/common/storage/dto/client.dto';
import { ClientService } from '../../../common/services/client.service';

@Injectable()
export class SecurityService {
  constructor(private readonly clientService: ClientService) {}

  createNewClient(newClientData: ClientCreateDTO): void {}
}
