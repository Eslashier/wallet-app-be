import { Controller, Post } from '@nestjs/common';
import { ClientCreateDTO } from '../storage/dto/ClientCreate.dto';

@Controller('security')
export class SecurityController {
  @Post('signup')
  signUp(newClientData: ClientCreateDTO): void {}
}
