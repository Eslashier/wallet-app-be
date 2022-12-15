import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { TokenVerificationGuard } from '../../../src/modules/security/guards/token-verification.guard';
import { AppService } from '../services/app.service';
import { UpdateAppReceiverDto } from '../storage/dto/app/update-app-receiver.dto';
import { UpdateAppDto } from '../storage/dto/app/update-app.dto';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // async getApps(): Promise<AppEntity[]> {
  //   return this.appService.getAll();
  // }

  @Patch('/:id')
  @UseGuards(TokenVerificationGuard)
  async updateApp(
    @Param('id') id: string,
    @Body() updateApp: UpdateAppReceiverDto,
  ) {
    const updatedApp = new UpdateAppDto(updateApp);
    return this.appService.updateApp(id, updatedApp);
  }
}
