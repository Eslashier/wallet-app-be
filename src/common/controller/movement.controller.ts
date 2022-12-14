import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TokenVerificationGuard } from 'src/modules/security/guards/token-verification.guard';
import { MovementService } from '../services/movement.service';
import { MovementEntity } from '../storage/databases/postgresql/entities/movement.entity';
import { CreateMovementDto } from '../storage/dto/movement/create-movement.dto';

@Controller('movement')
export class MovementController {
  constructor(private readonly movementService: MovementService) {}

  // @Get()
  // async getMovements(): Promise<MovementEntity[]> {
  //   return this.movementService.getAll();
  // }

  @Get('/:accountId')
  @UseGuards(TokenVerificationGuard)
  async getMovementsById(
    @Param('accountId') accountId: string,
  ): Promise<MovementEntity[]> {
    return this.movementService.getMovementsById(accountId);
  }

  @Post()
  @UseGuards(TokenVerificationGuard)
  async createMovement(
    @Body() movement: CreateMovementDto,
  ): Promise<MovementEntity> {
    const newMovement = new MovementEntity(movement);
    return this.movementService.createMovement(newMovement);
  }
}
