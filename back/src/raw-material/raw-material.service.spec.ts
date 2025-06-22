import { Test, TestingModule } from '@nestjs/testing';
import { RawMaterialService } from './raw-material.service';

describe('RawMaterialService', () => {
  let service: RawMaterialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RawMaterialService],
    }).compile();

    service = module.get<RawMaterialService>(RawMaterialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
