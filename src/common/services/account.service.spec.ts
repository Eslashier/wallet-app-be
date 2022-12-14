import {
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from '../storage/databases/postgresql/entities/account.entity';
import { AccountService } from './account.service';

const updateDate = new Date();

const testAccount = new AccountEntity();
testAccount.clientId = 'clientUUID';
testAccount.balance = '20000';
testAccount.credit = '1000';
testAccount.state = 1;
testAccount.createdDate = new Date();
testAccount.updatedDate = null;
testAccount.deletedDate = null;

const updatedTestAccount = { ...testAccount };
updatedTestAccount.balance = '20500';
updatedTestAccount.credit = '500';
updatedTestAccount.updatedDate = updateDate;

describe('AccountService', () => {
  let service: AccountService;
  let repositoryMock: Repository<AccountEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: getRepositoryToken(AccountEntity),
          useValue: {
            findOneOrFail: jest.fn().mockResolvedValue(testAccount),
            update: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    repositoryMock = module.get(getRepositoryToken(AccountEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAccountById', () => {
    it('should get one account', async () => {
      //Arrange
      const uuid = 'an uuid';
      const repoSpy = jest.spyOn(repositoryMock, 'findOneOrFail');
      //Act
      const accountFound = service.getAccount(uuid);
      //Assert
      expect(accountFound).resolves.toEqual(testAccount);
      expect(repoSpy).toBeCalledWith({ where: { id: uuid } });
    });
    it('should throw notFoundException', () => {
      //Arrange
      const badUuid = 'a bad uuid';
      const repoSpy = jest
        .spyOn(repositoryMock, 'findOneOrFail')
        .mockRejectedValueOnce(
          new NotFoundException(
            `Account with the id: ${badUuid} no accounts to show`,
          ),
        );
      //Act
      expect(service.getAccount(badUuid)).rejects.toThrow(
        new NotFoundException(
          `Account with the id: ${badUuid} no accounts to show`,
        ),
      );
      //Assert
      expect(repoSpy).toBeCalledWith({ where: { id: badUuid } });
      expect(repoSpy).toBeCalledTimes(1);
    });
  });

  describe('updateById', () => {
    it('should patch app', async () => {
      //Arrange
      const uuid = 'an uuid';
      const updatedAccount = await service.updateAccount(uuid, {
        balance: '500',
        credit: '-500',
        updatedDate: updateDate,
      });
      //Act
      expect(updatedAccount).toEqual(true);
      //Assert
      expect(repositoryMock.update).toBeCalledWith(
        { id: uuid },
        updatedTestAccount,
      );
      expect(repositoryMock.update).toBeCalledTimes(1);
    });
    it('should throw error amount greater than balance', async () => {
      //Arrange
      const uuid = 'an uuid';
      const repoSpy = jest.spyOn(repositoryMock, 'update');
      //Act
      expect(
        service.updateAccount(uuid, {
          balance: '-30000',
          updatedDate: updateDate,
        }),
      ).rejects.toThrow(
        new UnprocessableEntityException(
          'The amount cannot be greater than the balance',
        ),
      );
      //Assert
      expect(repoSpy).toBeCalledTimes(0);
    });
    it('The amount to loan cannot be greater than the credit', async () => {
      //Arrange
      const uuid = 'an uuid';
      const repoSpy = jest.spyOn(repositoryMock, 'update');
      //Act
      expect(
        service.updateAccount(uuid, {
          balance: '5000',
          credit: '-5000',
          updatedDate: updateDate,
        }),
      ).rejects.toThrow(
        new UnprocessableEntityException(
          'The amount to loan cannot be greater than the credit',
        ),
      );
      //Assert
      expect(repoSpy).toBeCalledTimes(0);
    });
    it('should throw notFoundException', () => {
      //Arrange
      const badUuid = 'a bad uuid';
      const repoSpy = jest
        .spyOn(repositoryMock, 'update')
        .mockRejectedValueOnce(
          new NotFoundException(
            'Account with the id: a bad uuid no accounts to show',
          ),
        );
      //Act
      expect(
        service.updateAccount(badUuid, {
          balance: '500',
          updatedDate: updateDate,
        }),
      ).rejects.toThrow(
        new NotFoundException(
          'Account with the id: a bad uuid no accounts to show',
        ),
      );
      //Assert
      expect(repoSpy).toBeCalledTimes(0);
      // expect(repoSpy).toBeCalledWith({ id: badUuid }, updatedTestAccount);
    });
  });
});
