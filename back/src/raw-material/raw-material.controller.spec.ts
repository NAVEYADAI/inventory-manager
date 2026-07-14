import { Test, TestingModule } from '@nestjs/testing';
import { RawMaterialController } from './raw-material.controller';
import { RawMaterialService } from './raw-material.service';
import { AuthService } from '../auth/auth.service';

describe('RawMaterialController', () => {
  let controller: RawMaterialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RawMaterialController],
      providers: [
        {
          provide: RawMaterialService,
          useValue: {},
        },
        {
          provide: AuthService,
          useValue: {
            validateToken: jest.fn().mockResolvedValue({ id: 1 }),
          },
        },
      ],
    }).compile();

    controller = module.get<RawMaterialController>(RawMaterialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

