import { Test, TestingModule } from '@nestjs/testing';
import { RecipeService } from './recipe.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Recipe } from './recipe.entity';
import { Subscription } from 'src/subscription/subscription.entity';
import { RawMaterial } from 'src/raw-material/raw-material.entity';
import { RecipeProduct } from 'src/recipe-product/recipe-product.entity';

describe('RecipeService', () => {
  let service: RecipeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeService,
        {
          provide: getRepositoryToken(Recipe),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Subscription),
          useValue: {},
        },
        {
          provide: getRepositoryToken(RawMaterial),
          useValue: {},
        },
        {
          provide: getRepositoryToken(RecipeProduct),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<RecipeService>(RecipeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
