import { Test, TestingModule } from '@nestjs/testing';
import { PlatoonService } from './platoon.service';

describe('PlatoonService', () => {
  let service: PlatoonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlatoonService],
    }).compile();

    service = module.get<PlatoonService>(PlatoonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
