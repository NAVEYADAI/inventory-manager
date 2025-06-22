import { Test, TestingModule } from '@nestjs/testing';
import { RecipeProductService } from './recipe-product.service';

describe('RecipeProductService', () => {
  let service: RecipeProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecipeProductService],
    }).compile();

    service = module.get<RecipeProductService>(RecipeProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
