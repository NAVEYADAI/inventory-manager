import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductService } from './create-product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateProduct } from './create-product.entity';
import { Recipe } from 'src/recipe/recipe.entity';
import { ActivityLogService } from 'src/activity-log/activity-log.service';

describe('CreateProductService', () => {
  let service: CreateProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProductService,
        {
          provide: getRepositoryToken(CreateProduct),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Recipe),
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

    service = module.get<CreateProductService>(CreateProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

