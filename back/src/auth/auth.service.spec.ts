import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Subscription } from 'src/subscription/subscription.entity';
import { UserPermission, PermissionRole } from 'src/use-permissions/use-permission.entity';
import { Repository } from 'typeorm';
import { ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userService: jest.Mocked<UserService>;
  let subscriptionRepo: jest.Mocked<Repository<Subscription>>;
  let permissionRepo: jest.Mocked<Repository<UserPermission>>;

  const mockUserService = {
    findByUserName: jest.fn(),
    getUserCompanies: jest.fn(),
    remove: jest.fn(),
    create: jest.fn(),
    getLatestPasswordForUser: jest.fn(),
    findOne: jest.fn(),
  };

  const mockSubscriptionRepo = {
    findOne: jest.fn(),
  };

  const mockPermissionRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: getRepositoryToken(Subscription),
          useValue: mockSubscriptionRepo,
        },
        {
          provide: getRepositoryToken(UserPermission),
          useValue: mockPermissionRepo,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get(UserService);
    subscriptionRepo = module.get(getRepositoryToken(Subscription));
    permissionRepo = module.get(getRepositoryToken(UserPermission));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const dto = {
      name: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      address: '123 St',
      phone: '123',
      email: 'test@example.com',
      password: 'password123',
    };

    it('should register a new user successfully if they do not exist yet', async () => {
      userService.findByUserName.mockResolvedValue(null);
      userService.create.mockResolvedValue({ id: 1, name: 'testuser' } as any);

      const result = await service.register(dto);

      expect(userService.findByUserName).toHaveBeenCalledWith('testuser');
      expect(userService.create).toHaveBeenCalledWith({
        userName: dto.name,
        firstName: dto.firstName,
        lastName: dto.lastName,
        address: dto.address,
        phone: dto.phone,
        email: dto.email,
        password: dto.password,
      });
      expect(result).toEqual({ id: 1, name: 'testuser' });
    });

    it('should delete stale existing user (with 0 subscriptions) and register them', async () => {
      const existingUser = { id: 99, name: 'testuser' };
      userService.findByUserName.mockResolvedValue(existingUser as any);
      userService.getUserCompanies.mockResolvedValue([]); // 0 subscriptions
      userService.remove.mockResolvedValue({ deleted: true } as any);
      userService.create.mockResolvedValue({ id: 100, name: 'testuser' } as any);

      const result = await service.register(dto);

      expect(userService.remove).toHaveBeenCalledWith(99);
      expect(userService.create).toHaveBeenCalled();
      expect(result).toEqual({ id: 100, name: 'testuser' });
    });

    it('should throw ConflictException if user already exists and has active/inactive subscriptions', async () => {
      const existingUser = { id: 99, name: 'testuser' };
      userService.findByUserName.mockResolvedValue(existingUser as any);
      userService.getUserCompanies.mockResolvedValue([{ id: 1 }] as any); // has subscription

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
      expect(userService.remove).not.toHaveBeenCalled();
      expect(userService.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const dto = { userName: 'testuser', password: 'password123' };
    const mockUser = { id: 1, name: 'testuser', email: 'test@example.com' };
    const mockPassword = { id: 10, hash: 'hashed_password' };

    it('should throw UnauthorizedException if user not found', async () => {
      userService.findByUserName.mockResolvedValue(null);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user has no password record', async () => {
      userService.findByUserName.mockResolvedValue(mockUser as any);
      userService.getLatestPasswordForUser.mockResolvedValue(null);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password hash comparison fails', async () => {
      const bcrypt = require('bcryptjs');
      userService.findByUserName.mockResolvedValue(mockUser as any);
      userService.getLatestPasswordForUser.mockResolvedValue(mockPassword as any);
      bcrypt.compare.mockResolvedValue(false); // does not match

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should sign JWT token and return user payload with active/inactive companies', async () => {
      const bcrypt = require('bcryptjs');
      userService.findByUserName.mockResolvedValue(mockUser as any);
      userService.getLatestPasswordForUser.mockResolvedValue(mockPassword as any);
      bcrypt.compare.mockResolvedValue(true);

      const mockSubs = [
        { id: 101, is_active: true, company: { id: 50, name: 'Company A' } },
        { id: 102, is_active: true, company: { id: 51, name: 'Company B' } },
      ];
      userService.getUserCompanies.mockResolvedValue(mockSubs as any);

      // Mock permission lookup
      permissionRepo.findOne.mockResolvedValue({ role: PermissionRole.OWNER } as any);

      // Mock jwt.sign
      (jwt.sign as jest.Mock).mockReturnValue('mock_token');

      const result = await service.login(dto);

      expect(permissionRepo.findOne).toHaveBeenCalledTimes(2);
      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({ sub: 1, email: 'test@example.com' }),
        expect.any(String),
        expect.objectContaining({ expiresIn: '12h' }),
      );
      expect(result).toEqual({
        accessToken: 'mock_token',
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'testuser',
          activeCompanies: [
            { id: 50, name: 'Company A', subscriptionId: 101, role: PermissionRole.OWNER },
            { id: 51, name: 'Company B', subscriptionId: 102, role: PermissionRole.OWNER },
          ],
          inactiveCompanies: [],
          selectedCompany: null,
        },
      });
    });

    it('should auto-select company if user has exactly one active company subscription', async () => {
      const bcrypt = require('bcryptjs');
      userService.findByUserName.mockResolvedValue(mockUser as any);
      userService.getLatestPasswordForUser.mockResolvedValue(mockPassword as any);
      bcrypt.compare.mockResolvedValue(true);

      const mockSubs = [
        { id: 101, is_active: true, company: { id: 50, name: 'Company A' } },
      ];
      userService.getUserCompanies.mockResolvedValue(mockSubs as any);
      permissionRepo.findOne.mockResolvedValue({ role: PermissionRole.EDITOR } as any);
      (jwt.sign as jest.Mock).mockReturnValue('mock_token_with_company');

      const result = await service.login(dto);

      expect(result.user.selectedCompany).toEqual({
        id: 50,
        name: 'Company A',
        subscriptionId: 101,
        role: PermissionRole.EDITOR,
      });
    });
  });

  describe('validateToken', () => {
    it('should throw UnauthorizedException if token is missing', async () => {
      await expect(service.validateToken('')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if jwt verification fails', async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('invalid signature');
      });

      await expect(service.validateToken('Bearer bad_token')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user not found in DB', async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ sub: 99 });
      userService.findOne.mockResolvedValue(null);

      await expect(service.validateToken('Bearer valid_token')).rejects.toThrow(UnauthorizedException);
    });

    it('should return user record if token is valid and user exists', async () => {
      const mockUser = { id: 1, name: 'testuser' };
      (jwt.verify as jest.Mock).mockReturnValue({ sub: 1 });
      userService.findOne.mockResolvedValue(mockUser as any);

      const result = await service.validateToken('Bearer valid_token');

      expect(jwt.verify).toHaveBeenCalledWith('valid_token', expect.any(String));
      expect(result).toEqual(mockUser);
    });
  });

  describe('selectCompany', () => {
    it('should throw NotFoundException if subscription is not found for user', async () => {
      subscriptionRepo.findOne.mockResolvedValue(null);

      await expect(service.selectCompany(1, 999)).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if subscription is inactive', async () => {
      subscriptionRepo.findOne.mockResolvedValue({ id: 10, is_active: false } as any);

      await expect(service.selectCompany(1, 10)).rejects.toThrow(UnauthorizedException);
    });

    it('should create default permission if user does not have permission record for company', async () => {
      const mockSub = {
        id: 10,
        is_active: true,
        company: { id: 50, name: 'Company A' },
      };
      subscriptionRepo.findOne.mockResolvedValue(mockSub as any);
      permissionRepo.findOne.mockResolvedValue(null); // no permission yet
      permissionRepo.create.mockReturnValue({ role: PermissionRole.ADMIN } as any);
      permissionRepo.save.mockResolvedValue({} as any);

      const mockUser = { id: 1, name: 'testuser', email: 'test@example.com' };
      userService.findOne.mockResolvedValue(mockUser as any);
      (jwt.sign as jest.Mock).mockReturnValue('new_token');

      const result = await service.selectCompany(1, 10);

      expect(permissionRepo.create).toHaveBeenCalledWith({
        user: { id: 1 },
        company: { id: 50 },
        role: PermissionRole.ADMIN,
      });
      expect(permissionRepo.save).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({
        accessToken: 'new_token',
        selectedCompany: {
          id: 50,
          name: 'Company A',
          subscriptionId: 10,
          role: PermissionRole.ADMIN,
        },
      }));
    });
  });
});
