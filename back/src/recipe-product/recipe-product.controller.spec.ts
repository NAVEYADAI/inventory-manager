import { Test, TestingModule } from '@nestjs/testing';
import { RecipeProductController } from './recipe-product.controller';
import { RecipeProductService } from './recipe-product.service';

describe('RecipeProductController', () => {
  let controller: RecipeProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipeProductController],
      providers: [RecipeProductService],
    }).compile();

    controller = module.get<RecipeProductController>(RecipeProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
