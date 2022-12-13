import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from '../storage/databases/postgresql/entities/account.entity';
import { AccountService } from './account.service';

const testAccount = new AccountEntity();
testAccount.clientId = 'clientUUID';
testAccount.balance = '20000';
testAccount.credit = '1000';
testAccount.state = 1;
testAccount.createdDate = new Date();
testAccount.updatedDate = null;
testAccount.deletedDate = null;
testAccount.balance = '100';

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
            findOne: jest.fn().mockResolvedValue(testAccount),
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
      const repoSpy = jest.spyOn(repositoryMock, 'findOne');
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
        .spyOn(repositoryMock, 'findOne')
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
});
