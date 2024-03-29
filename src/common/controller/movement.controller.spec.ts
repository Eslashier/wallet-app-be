import { Test, TestingModule } from '@nestjs/testing';
import { MovementService } from '../services/movement.service';
import { MovementEntity } from '../storage/databases/postgresql/entities/movement.entity';
import { CreateMovementDto } from '../storage/dto/movement/create-movement.dto';
import { MovementController } from './movement.controller';
import { TokenVerificationGuard } from 'src/modules/security/guards/token-verification.guard';
import { CanActivate } from '@nestjs/common';

const testMovementDto: CreateMovementDto = {
  incomeAccountId: 'an uuid',
  outcomeAccountId: 'an uuid',
  reason: 'a movement',
  amount: '0',
  fees: 0,
};

const testMovement = new MovementEntity(testMovementDto);

const testMovementLoanDto: CreateMovementDto = {
  incomeAccountId: 'an uuid2',
  outcomeAccountId: 'an uuid',
  reason: 'a movement',
  amount: '0',
  fees: 0,
};
const testMovementLoan = new MovementEntity(testMovementLoanDto);

const testMovementArray = [
  new MovementEntity(testMovementDto),
  new MovementEntity(testMovement),
];
describe('MovementController', () => {
  let controller: MovementController;

  beforeEach(async () => {
    const mock_TokenVerificationGuard: CanActivate = {
      canActivate: jest.fn(() => true),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovementController],
      providers: [
        {
          provide: MovementService,
          useValue: {
            getMovementsById: jest
              .fn()
              .mockImplementation((acccountId: string) =>
                Promise.resolve(testMovementArray),
              ),
            createMovement: jest
              .fn()
              .mockImplementation((movementToCreate: MovementEntity) =>
                Promise.resolve(testMovement),
              ),
          },
        },
      ],
    })
      .overrideGuard(TokenVerificationGuard)
      .useValue(mock_TokenVerificationGuard)
      .compile();

    controller = module.get<MovementController>(MovementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('newClient', () => {
    it('should create a new movement', async () => {
      await expect(controller.createMovement(testMovement)).resolves.toEqual(
        testMovement,
      );
    });
  });
  describe('getByClientData', () => {
    it('should return an array of movements', async () => {
      await expect(controller.getMovementsById('an uuid')).resolves.toEqual(
        testMovementArray,
      );
    });
  });
});
