import { CanActivate } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TokenVerificationGuard } from '../../../src/modules/security/guards/token-verification.guard';
import { AccountService } from '../services/account.service';
import { AccountController } from './account.controller';

describe('AccountController', () => {
  let controller: AccountController;
  let service: AccountService;

  beforeEach(async () => {
    const mock_TokenVerificationGuard: CanActivate = {
      canActivate: jest.fn(() => true),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        {
          provide: AccountService,
          useValue: {
            getAccount: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                id,
                clientId: 'clientUUID',
                balance: '1000',
                credit: '1000',
                state: 1,
                createdDate: Date,
                updatedDate: null,
                deletedDate: null,
              }),
            ),
          },
        },
      ],
    })
      .overrideGuard(TokenVerificationGuard)
      .useValue(mock_TokenVerificationGuard)
      .compile();

    controller = module.get<AccountController>(AccountController);
    service = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined', () => {
    expect(TokenVerificationGuard).toBeDefined();
  });

  describe('getById', () => {
    it('should get a single cat', async () => {
      await expect(controller.getClient('an id')).resolves.toEqual({
        clientId: 'clientUUID',
        balance: '1000',
        credit: '1000',
        state: 1,
        createdDate: Date,
        updatedDate: null,
        deletedDate: null,
        id: 'an id',
      });
      await expect(controller.getClient('another id')).resolves.toEqual({
        clientId: 'clientUUID',
        balance: '1000',
        credit: '1000',
        state: 1,
        createdDate: Date,
        updatedDate: null,
        deletedDate: null,
        id: 'another id',
      });
    });
  });
});
