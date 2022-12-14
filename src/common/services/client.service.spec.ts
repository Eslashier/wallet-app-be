import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientEntity } from '../storage/databases/postgresql/entities/client.entity';
import { CreateClientDto } from '../storage/dto/client/create-client.dto';
import { ClientService } from './client.service';

const testClientDto: CreateClientDto = {
  fullName: 'John Doe',
  email: 'johndoe@test.com',
  phone: '3003334444',
  photo: 'an uri with a photo',
};
const testClient = new ClientEntity(testClientDto);

describe('ClientService', () => {
  let service: ClientService;
  let repositoryMock: Repository<ClientEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientService,
        {
          provide: getRepositoryToken(ClientEntity),
          useValue: {
            create: jest.fn().mockResolvedValue(testClient),
            save: jest.fn().mockResolvedValue(true),
            findOne: jest.fn().mockResolvedValue(testClient),
            findOneOrFail: jest.fn().mockResolvedValue(testClient),
          },
        },
      ],
    }).compile();

    service = module.get<ClientService>(ClientService);
    repositoryMock = module.get(getRepositoryToken(ClientEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('createClient', () => {
    it('should successfully create and insert a client', () => {
      expect(service.createClient(testClient)).resolves.toEqual(testClient);
      expect(repositoryMock.create).toBeCalledTimes(1);
      expect(repositoryMock.create).toBeCalledWith(testClient);
      expect(repositoryMock.save).toBeCalledTimes(1);
    });
  });
  describe('getClientByEmail', () => {
    it('should get one client with relations', async () => {
      //Arrange
      const email = 'an email';
      const repoSpy = jest.spyOn(repositoryMock, 'findOneOrFail');
      //Act
      const clientFound = service.findClient(email);
      //Assert
      expect(clientFound).resolves.toEqual(testClient);
      expect(repoSpy).toBeCalledWith({
        where: {
          email: email,
        },
        relations: {
          app: true,
          account: true,
        },
      });
    });
    it('should throw notFoundException', () => {
      //Arrange
      const badEmail = 'a bad email';
      const repoSpy = jest
        .spyOn(repositoryMock, 'findOneOrFail')
        .mockRejectedValueOnce(
          new NotFoundException(
            `The client with the email : ${badEmail} has been not found`,
          ),
        );
      //Act
      expect(service.findClient(badEmail)).rejects.toThrow(
        new NotFoundException(
          `The client with the email : ${badEmail} has been not found`,
        ),
      );
      //Assert
      expect(repoSpy).toBeCalledWith({
        where: {
          email: badEmail,
        },
        relations: {
          app: true,
          account: true,
        },
      });
      expect(repoSpy).toBeCalledTimes(1);
    });
  });
  describe('isRegisteredClient', () => {
    it('should return true if the user exists', async () => {
      //Arrange
      const email = 'an email';
      const repoSpy = jest.spyOn(repositoryMock, 'findOneOrFail');
      //Act
      const clientFound = service.isRegisteredClient(email);
      //Assert
      expect(clientFound).resolves.toEqual(true);

      expect(repoSpy).toBeCalledWith({
        where: {
          email: email,
        },
      });
    });
    it('should return false if the user does not exists', async () => {
      //Arrange
      const unregisteredEmail = 'an email';
      const repoSpy = jest
        .spyOn(repositoryMock, 'findOneOrFail')
        .mockRejectedValue(false);
      //Act
      const clientFound = service.isRegisteredClient(unregisteredEmail);
      //Assert
      expect(clientFound).resolves.toEqual(false);

      expect(repoSpy).toBeCalledWith({
        where: {
          email: unregisteredEmail,
        },
      });
    });
  });
  describe('accountExists', () => {
    it('should return true if the account exists using email or phone', async () => {
      //Arrange
      const emailOrPhone = 'an email or phone that exists';
      const repoSpy = jest.spyOn(repositoryMock, 'findOneOrFail');
      //Act
      const clientFoundByEmail = service.accountExist(emailOrPhone);
      //Assert
      expect(clientFoundByEmail).resolves.toEqual(true);

      expect(repoSpy).toHaveBeenCalledWith({
        where: [
          {
            email: emailOrPhone,
          },
          {
            phone: emailOrPhone,
          },
        ],
      });
      expect(repoSpy).toBeCalledTimes(1);
    });
    it('should return false if the account does not exists', async () => {
      //Arrange
      const wrongEmailOrPhone = 'an email or phone that does not exists';
      const repoSpy = jest
        .spyOn(repositoryMock, 'findOneOrFail')
        .mockRejectedValue(false);
      //Act
      const clientFoundByEmail = service.accountExist(wrongEmailOrPhone);
      //Assert
      expect(clientFoundByEmail).resolves.toEqual(false);

      expect(repoSpy).toHaveBeenCalledWith({
        where: [
          {
            email: wrongEmailOrPhone,
          },
          {
            phone: wrongEmailOrPhone,
          },
        ],
      });
      expect(repoSpy).toBeCalledTimes(1);
    });
  });
  describe('findClient', () => {
    it('should return the client if the account exists using email or phone', async () => {
      //Arrange
      const emailOrPhone = 'an email or phone that exists';
      const repoSpy = jest
        .spyOn(repositoryMock, 'findOneOrFail')
        .mockResolvedValue(testClient);
      //Act
      const clientFoundByEmail = service.findClient(emailOrPhone);
      //Assert
      expect(clientFoundByEmail).resolves.toEqual(testClient);

      expect(repoSpy).toHaveBeenCalledWith({
        where: {
          email: emailOrPhone,
        },
        relations: {
          app: true,
          account: true,
        },
      });
      expect(repoSpy).toBeCalledTimes(1);
    });
    it('should return NotFoundException if the account does not exists', async () => {
      //Arrange
      const wrongEmailOrPhone = 'an email or phone that does not exists';
      const repoSpy = jest
        .spyOn(repositoryMock, 'findOneOrFail')
        .mockRejectedValue(
          new NotFoundException(
            `The client with the email : ${wrongEmailOrPhone} has been not found`,
          ),
        );
      //Act
      const clientFoundByEmail = service.findClient(wrongEmailOrPhone);
      //Assert
      expect(clientFoundByEmail).rejects.toEqual(
        new NotFoundException(
          `The client with the email : ${wrongEmailOrPhone} has been not found`,
        ),
      );

      expect(repoSpy).toHaveBeenCalledWith({
        where: {
          email: wrongEmailOrPhone,
        },
        relations: {
          app: true,
          account: true,
        },
      });
      expect(repoSpy).toBeCalledTimes(1);
    });
  });
});
