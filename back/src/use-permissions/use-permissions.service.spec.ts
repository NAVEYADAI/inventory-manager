import { Test, TestingModule } from '@nestjs/testing';
import { UserPermissionsService } from './use-permissions.service';

describe('UserPermissionsService', () => {
  let service: UserPermissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPermissionsService],
    }).compile();

    service = module.get<UserPermissionsService>(UserPermissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
