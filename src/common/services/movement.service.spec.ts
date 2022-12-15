import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { MovementService } from './movement.service';
import { Repository } from 'typeorm';
import { MovementEntity } from '../storage/databases/postgresql/entities/movement.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccountService } from './account.service';
import { AccountEntity } from '../storage/databases/postgresql/entities/account.entity';
import { CreateMovementDto } from 'src/common/storage/dto/movement/create-movement.dto';
import { resolve } from 'path';
import { UnprocessableEntityException } from '@nestjs/common';

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

const updateDate = new Date();

const testAccount = new AccountEntity();
testAccount.clientId = 'clientUUID';
testAccount.balance = '10000';
testAccount.credit = '10000';
testAccount.state = 1;
testAccount.createdDate = new Date();
testAccount.updatedDate = null;
testAccount.deletedDate = null;

const updatedTestAccount = { ...testAccount };
updatedTestAccount.balance = '20500';
updatedTestAccount.credit = '500';
updatedTestAccount.updatedDate = updateDate;

jest.mock('./account.service', () => {
  const accountServiceMock = { invoke: jest.fn() };
  return { AccountService: jest.fn(() => accountServiceMock) };
});

describe('MovementService', () => {
  let service: MovementService;
  let repositoryMock: Repository<MovementEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovementService,
        AccountService,
        {
          provide: getRepositoryToken(MovementEntity),
          useValue: {
            create: jest.fn().mockResolvedValue(true),
            save: jest.fn((data) => data),
            find: jest.fn().mockResolvedValue(testMovementArray),
          },
        },
        {
          provide: AccountService,
          useValue: {
            updateAccount: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MovementService>(MovementService);
    repositoryMock = module.get(getRepositoryToken(MovementEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findMovements', () => {
    it('should return an array of transactions', () => {
      //Arrange
      const clientUUID = 'an uuid';
      const repoSpy = jest.spyOn(repositoryMock, 'find');
      //Act
      const movements = service.getMovementsById(clientUUID);
      //Assert
      expect(movements).resolves.toEqual(testMovementArray);
      expect(repoSpy).toBeCalledWith({
        order: {
          dateTime: 'DESC',
        },
        where: [
          {
            incomeAccountId: clientUUID,
          },
          {
            outcomeAccountId: clientUUID,
          },
        ],
        skip: 0,
        take: 10,
      });
      expect(repoSpy).toBeCalledTimes(1);
    });
  });
  describe('createMovement', () => {
    it('should create a movement', async () => {
      jest.spyOn(repositoryMock, 'save').mockResolvedValue(testMovement);
      expect(service.createMovement(testMovement)).resolves.toEqual(
        testMovement,
      );
      expect(repositoryMock.create).toBeCalledWith(testMovement);
    });
    it('should create a movement', async () => {
      jest.spyOn(repositoryMock, 'save').mockResolvedValue(testMovementLoan);
      expect(service.createMovement(testMovementLoan)).resolves.toEqual(
        testMovementLoan,
      );
      expect(repositoryMock.create).toBeCalledWith(testMovementLoan);
    });
    it('should throw an UnprocessableEntityException', async () => {
      jest
        .spyOn(repositoryMock, 'save')
        .mockRejectedValue(new UnprocessableEntityException());
      expect(service.createMovement(testMovementLoan)).rejects.toEqual(
        new UnprocessableEntityException(),
      );
      expect(repositoryMock.create).toBeCalledWith(testMovementLoan);
    });
  });
});
