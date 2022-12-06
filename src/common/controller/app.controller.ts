import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { AppEntity } from '../storage/databases/postgresql/entities/app.entity';
import { UpdateAppReceiverDto } from '../storage/dto/app/update-app-receiver.dto';
import { UpdateAppDto } from '../storage/dto/app/update-app.dto';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getApps(): Promise<AppEntity[]> {
    return this.appService.getAll();
  }

  @Patch('/:id')
  async updateApp(
    @Param('id') id: string,
    @Body() updateApp: UpdateAppReceiverDto,
  ) {
    const updatedApp = new UpdateAppDto(updateApp);
    return this.appService.updateApp(id, updatedApp);
  }
}
