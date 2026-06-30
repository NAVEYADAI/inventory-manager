import { Test, TestingModule } from '@nestjs/testing';
import { TagService } from './tag.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { Subscription } from 'src/subscription/subscription.entity';
import { CreateProduct } from 'src/create-product/create-product.entity';

describe('TagService', () => {
  let service: TagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagService,
        {
          provide: getRepositoryToken(Tag),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Subscription),
          useValue: {},
        },
        {
          provide: getRepositoryToken(CreateProduct),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TagService>(TagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
