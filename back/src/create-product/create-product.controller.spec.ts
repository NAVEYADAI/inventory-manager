import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductController } from './create-product.controller';
import { CreateProductService } from './create-product.service';

describe('CreateProductController', () => {
  let controller: CreateProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateProductController],
      providers: [CreateProductService],
    }).compile();

    controller = module.get<CreateProductController>(CreateProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
