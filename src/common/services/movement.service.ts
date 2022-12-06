import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovementEntity } from '../storage/databases/postgresql/entities/movement.entity';
import { CreateMovementDto } from 'src/common/storage/dto/movement/create-movement.dto';

@Injectable()
export class MovementService {
  constructor(
    @InjectRepository(MovementEntity)
    private readonly movementRepository: Repository<MovementEntity>,
  ) {}

  async getAll(): Promise<MovementEntity[]> {
    const movements = await this.movementRepository.find();
    if (movements.length === 0) {
      throw new NotFoundException('there is no movements to show');
    }
    return movements;
  }

  async getMovementsById(accountId: string): Promise<MovementEntity[]> {
    const movements = (
      await this.movementRepository.find({
        where: { incomeAccountId: accountId },
      })
    )
      .concat(
        await this.movementRepository.find({
          where: { outcomeAccountId: accountId },
        }),
      )
      .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());
    if (movements.length === 0) {
      throw new NotFoundException('there is no movements to show');
    }
    const trimmedMovements = movements.slice(0, 10);
    return trimmedMovements;
  }

  async createMovement(movement: CreateMovementDto): Promise<MovementEntity> {
    const newMovement = this.movementRepository.create(movement);
    await this.movementRepository.save(newMovement);
    return newMovement;
  }
}
