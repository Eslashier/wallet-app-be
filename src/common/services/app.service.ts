import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppEntity } from '../storage/databases/postgresql/entities/app.entity';
import { UpdateAppDto } from '../storage/dto/app/update-app.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(AppEntity)
    private readonly appRepository: Repository<AppEntity>,
  ) {}

  async getAll(): Promise<AppEntity[]> {
    const clients = await this.appRepository.find();
    if (clients.length === 0) {
      throw new NotFoundException('there is no clients to show');
    }
    return clients;
  }

  async findById(id: string): Promise<AppEntity> {
    const app = await this.appRepository.findOne({ where: { id } });
    if (!app) {
      throw new NotFoundException('there is no clients to show');
    }
    return app;
  }

  async updateApp(id: string, updateApp: UpdateAppDto): Promise<AppEntity> {
    await this.appRepository.update({ id }, updateApp);
    return this.findById(id);
  }
}
