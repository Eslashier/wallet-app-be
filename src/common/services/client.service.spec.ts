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
  describe('getAppById', () => {
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
      const repoSpy = jest.spyOn(repositoryMock, 'findOne');
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
        .spyOn(repositoryMock, 'findOne')
        .mockRejectedValue(false);
      //Act
      const clientFound = service.isRegisteredClient(unregisteredEmail);
      //Assert
      expect(clientFound).rejects.toEqual(false);

      expect(repoSpy).toBeCalledWith({
        where: {
          email: unregisteredEmail,
        },
      });
    });
  });
  describe('accountExists', () => {
    it('should return true if the account exists using email', async () => {
      //Arrange
      const email = 'an email';
      const repoSpy = jest
        .spyOn(repositoryMock, 'findOne')
        .mockResolvedValue(testClient);
      //Act
      const clientFoundByEmail = service.accountExist(email);
      //Assert
      expect(clientFoundByEmail).resolves.toEqual(true);

      // expect(repoSpy).toHaveBeenCalledWith({
      //   where: {
      //     email: email,
      //   },
      // });
      // expect(repoSpy).toBeCalledTimes(1);
    });
    it('should return false if the account does not exists', async () => {
      //Arrange
      const phone = 'a phone number';
      const repoSpy = jest
        .spyOn(repositoryMock, 'findOne')
        .mockRejectedValue(false);

      //Act
      const clientFoundByPhone = service.accountExist(phone);
      //Assert
      expect(clientFoundByPhone).rejects.toEqual(false);

      // expect(repoSpy).toHaveBeenCalledWith({
      //   where: {
      //     email: phone,
      //   },
      // });
      // expect(repoSpy).toBeCalledTimes(1);
    });
  });
  describe('findClientAccount', () => {
    it('should return true if the account exists using email', async () => {
      //Arrange
      const email = 'an email';
      const repoSpy = jest
        .spyOn(repositoryMock, 'findOne')
        .mockResolvedValue(testClient);
      //Act
      const clientFoundByEmail = service.findClientAccount(email);
      //Assert
      console.log(clientFoundByEmail);
      expect(clientFoundByEmail).resolves.toEqual(testClient);

      expect(repoSpy).toHaveBeenCalledWith({
        where: {
          email: email,
        },
        relations: {
          app: true,
          account: true,
        },
      });
      expect(repoSpy).toBeCalledTimes(1);
    });
    it('should return false if the account does not exists', async () => {
      //Arrange
      const email = 'an email';
      const repoSpy = jest
        .spyOn(repositoryMock, 'findOne')
        .mockRejectedValueOnce(
          new NotFoundException(
            `The client with the info : ${email} has been not found`,
          ),
        );

      //Act
      const clientFoundByPhone = service.findClientAccount(email);
      //Assert
      expect(clientFoundByPhone).rejects.toEqual(
        new NotFoundException(
          `The client with the info : ${email} has been not found`,
        ),
      );

      expect(repoSpy).toHaveBeenCalledWith({
        where: {
          email: email,
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
