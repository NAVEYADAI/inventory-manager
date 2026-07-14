import { Test, TestingModule } from '@nestjs/testing';
import { RawMaterialService } from './raw-material.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RawMaterial } from './raw-material.entity';
import { Subscription } from 'src/subscription/subscription.entity';
import { RawMaterialConversion } from './raw-material-conversion.entity';
import { ActivityLogService } from 'src/activity-log/activity-log.service';

describe('RawMaterialService', () => {
  let service: RawMaterialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RawMaterialService,
        {
          provide: getRepositoryToken(RawMaterial),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Subscription),
          useValue: {},
        },
        {
          provide: getRepositoryToken(RawMaterialConversion),
          useValue: {},
        },
        {
          provide: ActivityLogService,
          useValue: {
            log: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<RawMaterialService>(RawMaterialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

