import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppEntity } from '../storage/databases/postgresql/entities/app.entity';
import { AppService } from './app.service';

const testApp = new AppEntity();
testApp.clientId = 'clientUUID';
testApp.color = 'default';
testApp.createdDate = new Date();
testApp.updatedDate = null;

describe('AppService', () => {
  let service: AppService;
  let repositoryMock: Repository<AppEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: getRepositoryToken(AppEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(testApp),
            update: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    repositoryMock = module.get(getRepositoryToken(AppEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAppById', () => {
    it('should get one account', async () => {
      //Arrange
      const uuid = 'an uuid';
      const repoSpy = jest.spyOn(repositoryMock, 'findOne');
      //Act
      const accountFound = service.findById(uuid);
      //Assert
      expect(accountFound).resolves.toEqual(testApp);
      expect(repoSpy).toBeCalledWith({ where: { id: uuid } });
    });
    it('should throw notFoundException', () => {
      //Arrange
      const badUuid = 'a bad uuid';
      const repoSpy = jest
        .spyOn(repositoryMock, 'findOne')
        .mockRejectedValueOnce(
          new NotFoundException(
            `There is no apps to show with the id: ${badUuid}`,
          ),
        );
      //Act
      expect(service.findById(badUuid)).rejects.toThrow(
        new NotFoundException(
          `There is no apps to show with the id: ${badUuid}`,
        ),
      );
      //Assert
      expect(repoSpy).toBeCalledWith({ where: { id: badUuid } });
      expect(repoSpy).toBeCalledTimes(1);
    });
  });
});
