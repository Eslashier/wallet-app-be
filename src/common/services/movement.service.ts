import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovementEntity } from '../storage/databases/postgresql/entities/movement.entity';
import { CreateMovementDto } from 'src/common/storage/dto/movement/create-movement.dto';
import { UpdateAccountDto } from '../storage/dto/account/update-account.dto';
import { AccountService } from './account.service';
import { ExceptionFilter } from '@nestjs/common';

@Injectable()
export class MovementService {
  constructor(
    @InjectRepository(MovementEntity)
    private readonly movementRepository: Repository<MovementEntity>,
    private readonly accountService: AccountService,
  ) {}

  // async getAll(): Promise<MovementEntity[]> {
  //   const movements = await this.movementRepository.find();
  //   if (movements.length === 0) {
  //     throw new NotFoundException('there is no movements to show');
  //   }
  //   return movements;
  // }

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
    const uniqueIds = new Set();
    const movementsDuplicated = movements.filter((movement) => {
      const isDuplicate = uniqueIds.has(movement.id);
      uniqueIds.add(movement.id);

      return !isDuplicate ? true : false;
    });

    const trimmedMovements = movementsDuplicated.slice(0, 10);
    return trimmedMovements;
  }

  async createMovement(movement: CreateMovementDto): Promise<MovementEntity> {
    try {
      const newMovement = this.movementRepository.create(movement);
      if (movement.incomeAccountId === movement.outcomeAccountId) {
        const updateAccount = new UpdateAccountDto();
        updateAccount.balance = movement.amount;
        updateAccount.credit = '-' + movement.amount;
        updateAccount.updatedDate = new Date();
        await this.accountService.updateAccount(
          movement.incomeAccountId,
          updateAccount,
        );
        await this.movementRepository.save(newMovement);
      } else {
        const incomeAccount = new UpdateAccountDto();
        incomeAccount.balance = newMovement.amount;
        incomeAccount.updatedDate = new Date();
        await this.accountService.updateAccount(
          movement.incomeAccountId,
          incomeAccount,
        );
        const outcomeAccount = new UpdateAccountDto();
        outcomeAccount.balance = '-' + newMovement.amount;
        outcomeAccount.updatedDate = new Date();
        await this.accountService.updateAccount(
          movement.outcomeAccountId,
          outcomeAccount,
        );
        await this.movementRepository.save(newMovement);
      }
      console.log(newMovement);
      return newMovement;
    } catch (err) {
      if (err.response.message)
        throw new UnprocessableEntityException(err.response);
      else
        throw new UnprocessableEntityException(
          'something went wrong creating the movement',
        );
    }
  }
}
