import { Test, TestingModule } from '@nestjs/testing';
import { PlatoonController } from './platoon.controller';
import { PlatoonService } from './platoon.service';

describe('PlatoonController', () => {
  let controller: PlatoonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlatoonController],
      providers: [PlatoonService],
    }).compile();

    controller = module.get<PlatoonController>(PlatoonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
