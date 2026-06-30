import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductController } from './create-product.controller';
import { CreateProductService } from './create-product.service';
import { AuthService } from 'src/auth/auth.service';

describe('CreateProductController', () => {
  let controller: CreateProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateProductController],
      providers: [
        {
          provide: CreateProductService,
          useValue: {},
        },
        {
          provide: AuthService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<CreateProductController>(CreateProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
