import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from '../services/app.service';
import { UpdateAppReceiverDto } from '../storage/dto/app/update-app-receiver.dto';
import { UpdateAppDto } from '../storage/dto/app/update-app.dto';
import { TokenVerificationGuard } from '../../../src/modules/security/guards/token-verification.guard';
import { CanActivate } from '@nestjs/common';

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  beforeEach(async () => {
    const mock_TokenVerificationGuard: CanActivate = {
      canActivate: jest.fn(() => true),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            updateApp: jest
              .fn()
              .mockImplementation(
                (id: string, updateApp: UpdateAppReceiverDto) =>
                  Promise.resolve({ id: id, ...updateApp }),
              ),
          },
        },
        {
          provide: TokenVerificationGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
      ],
    })
      .overrideGuard(TokenVerificationGuard)
      .useValue(mock_TokenVerificationGuard)
      .compile();

    controller = module.get<AppController>(AppController);
    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('patchApp', () => {
    it('should patch an existing app', async () => {
      const newAppDto: UpdateAppDto = new UpdateAppDto({ color: 'default' });
      const idApp = 'an uuid';
      await expect(controller.updateApp(idApp, newAppDto)).resolves.toEqual({
        id: idApp,
        ...newAppDto,
      });
    });
  });
});
