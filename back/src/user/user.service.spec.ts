import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Password } from 'src/password/password.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let userRepo: jest.Mocked<Repository<User>>;
  let passwordRepo: jest.Mocked<Repository<Password>>;

  const mockUserRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockPasswordRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
        {
          provide: getRepositoryToken(Password),
          useValue: mockPasswordRepo,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepo = module.get(getRepositoryToken(User));
    passwordRepo = module.get(getRepositoryToken(Password));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user and hash/save their password', async () => {
      const createUserDto = {
        userName: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        address: '123 Main St',
        phone: '1234567890',
        email: 'test@example.com',
        password: 'securePassword123',
      };

      const mockSavedUser = {
        id: 1,
        name: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        address: '123 Main St',
        phone: '1234567890',
        email: 'test@example.com',
      };

      userRepo.create.mockReturnValue(mockSavedUser as any);
      userRepo.save.mockResolvedValue(mockSavedUser as any);
      passwordRepo.create.mockReturnValue({} as any);
      passwordRepo.save.mockResolvedValue({} as any);

      const result = await service.create(createUserDto);

      expect(userRepo.create).toHaveBeenCalledWith({
        name: createUserDto.userName,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        address: createUserDto.address,
        phone: createUserDto.phone,
        email: createUserDto.email,
      });
      expect(userRepo.save).toHaveBeenCalledWith(mockSavedUser);
      expect(passwordRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          password: '',
          hash: expect.any(String),
          date: expect.any(Date),
          user: mockSavedUser,
        }),
      );
      expect(passwordRepo.save).toHaveBeenCalled();
      expect(result).toEqual(mockSavedUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [{ id: 1, name: 'user1' }, { id: 2, name: 'user2' }];
      userRepo.find.mockResolvedValue(mockUsers as any);

      const result = await service.findAll();

      expect(userRepo.find).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const mockUser = { id: 1, name: 'user1' };
      userRepo.findOne.mockResolvedValue(mockUser as any);

      const result = await service.findOne(1);

      expect(userRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(userRepo.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    });
  });

  describe('findByEmail', () => {
    it('should query user repository by email', async () => {
      const mockUser = { id: 1, email: 'test@test.com' };
      userRepo.findOne.mockResolvedValue(mockUser as any);

      const result = await service.findByEmail('test@test.com');

      expect(userRepo.findOne).toHaveBeenCalledWith({ where: { email: 'test@test.com' } });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findByUserName', () => {
    it('should query user repository by username (name field)', async () => {
      const mockUser = { id: 1, name: 'testuser' };
      userRepo.findOne.mockResolvedValue(mockUser as any);

      const result = await service.findByUserName('testuser');

      expect(userRepo.findOne).toHaveBeenCalledWith({ where: { name: 'testuser' } });
      expect(result).toEqual(mockUser);
    });
  });

  describe('getLatestPasswordForUser', () => {
    it('should return the latest password entry ordered by date descending', async () => {
      const mockPassword = { id: 5, hash: 'some_hash', date: new Date() };
      passwordRepo.findOne.mockResolvedValue(mockPassword as any);

      const result = await service.getLatestPasswordForUser(1);

      expect(passwordRepo.findOne).toHaveBeenCalledWith({
        where: { user: { id: 1 } as any },
        order: { date: 'DESC' },
      });
      expect(result).toEqual(mockPassword);
    });
  });

  describe('update', () => {
    it('should update user and return the updated user record', async () => {
      const mockUser = { id: 1, name: 'updated_name' };
      userRepo.update.mockResolvedValue({} as any);
      userRepo.findOne.mockResolvedValue(mockUser as any);

      const result = await service.update(1, { userName: 'updated_name' } as any);

      expect(userRepo.update).toHaveBeenCalledWith(1, { userName: 'updated_name' } as any);
      expect(result).toEqual(mockUser);
    });
  });

  describe('remove', () => {
    it('should delete passwords associated with user and then delete the user', async () => {
      passwordRepo.delete.mockResolvedValue({} as any);
      userRepo.delete.mockResolvedValue({} as any);

      const result = await service.remove(1);

      expect(passwordRepo.delete).toHaveBeenCalledWith({ user: { id: 1 } as any });
      expect(userRepo.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ deleted: true });
    });
  });

  describe('getUserCompanies', () => {
    it('should return user subscriptions if user is found', async () => {
      const mockSubscriptions = [
        { id: 10, company: { id: 100, name: 'Company A' } },
        { id: 11, company: { id: 101, name: 'Company B' } },
      ];
      const mockUser = { id: 1, name: 'user1', subscriptions: mockSubscriptions };
      userRepo.findOne.mockResolvedValue(mockUser as any);

      const result = await service.getUserCompanies(1);

      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['subscriptions', 'subscriptions.company'],
      });
      expect(result).toEqual(mockSubscriptions);
    });

    it('should return an empty array if user has no subscriptions', async () => {
      const mockUser = { id: 1, name: 'user1', subscriptions: null };
      userRepo.findOne.mockResolvedValue(mockUser as any);

      const result = await service.getUserCompanies(1);

      expect(result).toEqual([]);
    });

    it('should throw NotFoundException if user is not found', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(service.getUserCompanies(999)).rejects.toThrow(NotFoundException);
    });
  });
});
