import { Test, TestingModule } from '@nestjs/testing';
import { ClientService } from '../services/client.service';
import { ClientController } from './client.controller';
import { ClientEntity } from '../storage/databases/postgresql/entities/client.entity';
import { CreateClientDto } from '../storage/dto/client/create-client.dto';
import { CanActivate } from '@nestjs/common';
import { TokenVerificationGuard } from '../../../src/modules/security/guards/token-verification.guard';

const testClientDto: CreateClientDto = {
  fullName: 'John Doe',
  email: 'johndoe@test.com',
  phone: '3003334444',
  photo: 'an uri with a photo',
};
const testClient = new ClientEntity(testClientDto);
testClient.id = 'an uuid';
testClient.app.id = 'an uuid';
testClient.account.id = 'an uuid';

describe('ClientController', () => {
  let controller: ClientController;

  beforeEach(async () => {
    const mock_TokenVerificationGuard: CanActivate = {
      canActivate: jest.fn(() => true),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [
        {
          provide: ClientService,
          useValue: {
            createClient: jest
              .fn()
              .mockImplementation((clientToCreate: ClientEntity) =>
                Promise.resolve(testClient),
              ),
            findClientAccount: jest
              .fn()
              .mockImplementation((clientInfo: string) =>
                Promise.resolve(testClient),
              ),
            findClient: jest
              .fn()
              .mockImplementation((email: string) =>
                Promise.resolve(testClient),
              ),
            accountExist: jest
              .fn()
              .mockImplementation((clientInfo: string) =>
                Promise.resolve(true),
              ),
            isRegisteredClient: jest
              .fn()
              .mockImplementation((email: string) => Promise.resolve(true)),
          },
        },
      ],
    })
      .overrideGuard(TokenVerificationGuard)
      .useValue(mock_TokenVerificationGuard)
      .compile();

    controller = module.get<ClientController>(ClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('newClient', () => {
    it('should create a new client', async () => {
      await expect(controller.createClient(testClient)).resolves.toEqual({
        ...testClient,
      });
    });
  });
  describe('getByClientData', () => {
    it('should get a client', async () => {
      await expect(
        controller.findClientAccount('johndoe@test.com'),
      ).resolves.toEqual(testClient);
    });
  });
  describe('getByClientEmail', () => {
    it('should get a client', async () => {
      await expect(controller.findClient('johndoe@test.com')).resolves.toEqual(
        testClient,
      );
    });
  });
  describe('getByClientData', () => {
    it('should get true if the client exists', async () => {
      await expect(
        controller.accountExist('johndoe@test.com'),
      ).resolves.toEqual(true);
    });
  });
  describe('getByClientData', () => {
    it('should get true if the client exists', async () => {
      await expect(
        controller.isRegisteredClient('johndoe@test.com'),
      ).resolves.toEqual(true);
    });
  });
});
