import { Controller, Post } from '@nestjs/common';
import { ClientCreateDTO } from 'src/common/storage/dto/client.dto';


@Controller('security')
export class SecurityController {
  @Post('signup')
  signUp(newClientData: ClientCreateDTO): void {}
}
