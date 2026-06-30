import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { Subscription } from 'src/subscription/subscription.entity';
import { User } from 'src/user/user.entity';
import { UserPermission, PermissionRole } from 'src/use-permissions/use-permission.entity';
import { DataSource } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('CompanyService', () => {
  let service: CompanyService;
  let companyRepo: any;
  let subscriptionRepo: any;
  let userRepo: any;
  let permissionRepo: any;
  let passwordRepo: any;
  let dataSource: any;

  const mockCompanyRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockSubscriptionRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockUserRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockPermissionRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
  };

  const mockPasswordRepo = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockEntityManager = {
    withRepository: jest.fn((repo) => repo),
    getRepository: jest.fn((entityName) => {
      if (entityName === 'Password') {
        return mockPasswordRepo;
      }
      return null;
    }),
  };

  const mockDataSource = {
    transaction: jest.fn(async (cb) => cb(mockEntityManager)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: getRepositoryToken(Company),
          useValue: mockCompanyRepo,
        },
        {
          provide: getRepositoryToken(Subscription),
          useValue: mockSubscriptionRepo,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
        {
          provide: getRepositoryToken(UserPermission),
          useValue: mockPermissionRepo,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    companyRepo = module.get(getRepositoryToken(Company));
    subscriptionRepo = module.get(getRepositoryToken(Subscription));
    userRepo = module.get(getRepositoryToken(User));
    permissionRepo = module.get(getRepositoryToken(UserPermission));
    dataSource = module.get(DataSource);

    mockCompanyRepo.findOne.mockResolvedValue(null);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a company without owner subscription if ownerId is not provided', async () => {
      const dto = { name: 'My Company' };
      const savedCompany = { id: 1, name: 'My Company' };
      mockCompanyRepo.create.mockReturnValue(savedCompany);
      mockCompanyRepo.save.mockResolvedValue(savedCompany);

      const result = await service.create(dto);

      expect(mockCompanyRepo.create).toHaveBeenCalledWith({ name: 'My Company' });
      expect(mockCompanyRepo.save).toHaveBeenCalledWith(savedCompany);
      expect(result).toEqual({ company: savedCompany, subscription: null });
    });

    it('should create a company and link user with OWNER permissions if ownerId is provided', async () => {
      const dto = { name: 'My Company', ownerId: 42 };
      const savedCompany = { id: 1, name: 'My Company' };
      const mockUser = { id: 42, name: 'OwnerUser' };
      const mockSubscription = { id: 10, company: savedCompany, users: [mockUser] };

      mockCompanyRepo.create.mockReturnValue(savedCompany);
      mockCompanyRepo.save.mockResolvedValue(savedCompany);
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      mockSubscriptionRepo.create.mockReturnValue(mockSubscription);
      mockSubscriptionRepo.save.mockResolvedValue(mockSubscription);
      mockPermissionRepo.create.mockReturnValue({});
      mockPermissionRepo.save.mockResolvedValue({});

      const result = await service.create(dto);

      expect(mockUserRepo.findOne).toHaveBeenCalledWith({ where: { id: 42 } });
      expect(mockSubscriptionRepo.create).toHaveBeenCalledWith({
        company: savedCompany,
        users: [mockUser],
      });
      expect(mockSubscriptionRepo.save).toHaveBeenCalledWith(mockSubscription);
      expect(mockPermissionRepo.create).toHaveBeenCalledWith({
        user: mockUser,
        company: savedCompany,
        role: PermissionRole.OWNER,
      });
      expect(result).toEqual({ company: savedCompany, subscription: mockSubscription });
    });

    it('should throw ConflictException if company name and identifier already exist', async () => {
      const dto = { name: 'Duplicate Company', identifier: '123' };
      mockCompanyRepo.findOne.mockResolvedValue({ id: 9, name: 'Duplicate Company', identifier: '123' });

      await expect(service.create(dto)).rejects.toThrow('חברה עם שם ומזהה אלו כבר קיימת במערכת');
      expect(mockCompanyRepo.findOne).toHaveBeenCalledWith({
        where: { name: 'Duplicate Company', identifier: '123' },
      });
      expect(mockCompanyRepo.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if owner user does not exist', async () => {
      const dto = { name: 'My Company', ownerId: 999 };
      mockCompanyRepo.findOne.mockResolvedValue(null);
      mockCompanyRepo.create.mockReturnValue({});
      mockCompanyRepo.save.mockResolvedValue({});
      mockUserRepo.findOne.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('registerEmployee', () => {
    const dto = {
      name: 'employee1',
      email: 'emp1@test.com',
      password: 'password123',
      role: PermissionRole.EDITOR,
    };

    it('should throw Error if user exists and is already in subscription', async () => {
      const existingUser = { id: 5, name: 'employee1', email: 'emp1@test.com' };
      mockUserRepo.findOne.mockResolvedValueOnce(existingUser);
      mockSubscriptionRepo.findOne.mockResolvedValue({ id: 1 }); // subscription found

      await expect(service.registerEmployee(1, dto)).rejects.toThrow('העובד כבר רשום בחברה זו');
    });

    it('should link existing user to subscription if user exists but not in company subscription', async () => {
      const existingUser = { id: 5, name: 'employee1', email: 'emp1@test.com' };
      const sub = { id: 1, users: [] };
      mockUserRepo.findOne.mockResolvedValueOnce(existingUser);
      mockSubscriptionRepo.findOne.mockResolvedValueOnce(null); // not in this company subscription yet
      mockSubscriptionRepo.findOne.mockResolvedValueOnce(sub); // inside step 2 fetching subscription
      mockSubscriptionRepo.save.mockResolvedValue({});
      mockPermissionRepo.findOne.mockResolvedValue(null);
      mockPermissionRepo.create.mockReturnValue({});
      mockPermissionRepo.save.mockResolvedValue({});

      const result = await service.registerEmployee(1, dto);

      expect(mockSubscriptionRepo.save).toHaveBeenCalledWith({
        id: 1,
        users: [existingUser],
      });
      expect(result).toEqual({ user: existingUser, isNewUser: false });
    });

    it('should create a new user and add to subscription & create permission if user does not exist', async () => {
      const newUser = { id: 10, name: 'employee1', email: 'emp1@test.com' };
      const sub = { id: 1, users: [] };

      mockUserRepo.findOne.mockResolvedValue(null); // does not exist
      mockUserRepo.create.mockReturnValue(newUser);
      mockUserRepo.save.mockResolvedValue(newUser);
      mockPasswordRepo.create.mockReturnValue({});
      mockPasswordRepo.save.mockResolvedValue({});

      mockSubscriptionRepo.findOne.mockResolvedValue(sub);
      mockSubscriptionRepo.save.mockResolvedValue({});
      mockPermissionRepo.findOne.mockResolvedValue(null);
      mockPermissionRepo.create.mockReturnValue({});
      mockPermissionRepo.save.mockResolvedValue({});

      const result = await service.registerEmployee(1, dto);

      expect(mockUserRepo.create).toHaveBeenCalledWith(expect.objectContaining({
        name: 'employee1',
        email: 'emp1@test.com',
      }));
      expect(mockPasswordRepo.create).toHaveBeenCalledWith(expect.objectContaining({
        hash: expect.any(String),
        user: newUser,
      }));
      expect(mockSubscriptionRepo.save).toHaveBeenCalledWith({
        id: 1,
        users: [newUser],
      });
      expect(mockPermissionRepo.create).toHaveBeenCalledWith({
        user: newUser,
        company: { id: 1 },
        role: PermissionRole.EDITOR,
      });
      expect(result).toEqual({ user: newUser, isNewUser: true });
    });
  });

  describe('updateEmployeeRole', () => {
    it('should throw ForbiddenException if caller is not member of company', async () => {
      mockPermissionRepo.find.mockResolvedValue([
        { user: { id: 2 }, role: PermissionRole.EDITOR },
      ]);

      await expect(service.updateEmployeeRole(1, 2, PermissionRole.ADMIN, 99)).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if target user is not member of company', async () => {
      mockPermissionRepo.find.mockResolvedValue([
        { user: { id: 1 }, role: PermissionRole.OWNER },
      ]);

      await expect(service.updateEmployeeRole(1, 99, PermissionRole.EDITOR, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if caller is not owner/admin', async () => {
      mockPermissionRepo.find.mockResolvedValue([
        { user: { id: 1 }, role: PermissionRole.EDITOR },
        { user: { id: 2 }, role: PermissionRole.VIEWER },
      ]);

      await expect(service.updateEmployeeRole(1, 2, PermissionRole.EDITOR, 1)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if caller tries to update their own role', async () => {
      mockPermissionRepo.find.mockResolvedValue([
        { user: { id: 1 }, role: PermissionRole.OWNER },
      ]);

      await expect(service.updateEmployeeRole(1, 1, PermissionRole.ADMIN, 1)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if caller tries to update owner role', async () => {
      mockPermissionRepo.find.mockResolvedValue([
        { user: { id: 1 }, role: PermissionRole.ADMIN },
        { user: { id: 2 }, role: PermissionRole.OWNER },
      ]);

      await expect(service.updateEmployeeRole(1, 2, PermissionRole.EDITOR, 1)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if admin caller tries to update another admin role', async () => {
      mockPermissionRepo.find.mockResolvedValue([
        { user: { id: 1 }, role: PermissionRole.ADMIN },
        { user: { id: 2 }, role: PermissionRole.ADMIN },
      ]);

      await expect(service.updateEmployeeRole(1, 2, PermissionRole.EDITOR, 1)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if admin caller tries to set target role to ADMIN/OWNER', async () => {
      mockPermissionRepo.find.mockResolvedValue([
        { user: { id: 1 }, role: PermissionRole.ADMIN },
        { user: { id: 2 }, role: PermissionRole.EDITOR },
      ]);

      await expect(service.updateEmployeeRole(1, 2, PermissionRole.ADMIN, 1)).rejects.toThrow(ForbiddenException);
    });

    it('should successfully update role if owner makes valid change', async () => {
      const targetPermission = { user: { id: 2 }, role: PermissionRole.EDITOR };
      mockPermissionRepo.find.mockResolvedValue([
        { user: { id: 1 }, role: PermissionRole.OWNER },
        targetPermission,
      ]);
      mockPermissionRepo.save.mockResolvedValue({ ...targetPermission, role: PermissionRole.ADMIN });

      const result = await service.updateEmployeeRole(1, 2, PermissionRole.ADMIN, 1);

      expect(targetPermission.role).toBe(PermissionRole.ADMIN);
      expect(mockPermissionRepo.save).toHaveBeenCalledWith(targetPermission);
      expect(result.role).toBe(PermissionRole.ADMIN);
    });
  });

  describe('removeEmployee', () => {
    it('should throw ForbiddenException if caller is not manager/owner', async () => {
      mockPermissionRepo.find.mockResolvedValue([
        { user: { id: 1 }, role: PermissionRole.EDITOR },
        { user: { id: 2 }, role: PermissionRole.VIEWER },
      ]);

      await expect(service.removeEmployee(1, 2, 1)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if admin tries to remove another admin', async () => {
      mockPermissionRepo.find.mockResolvedValue([
        { user: { id: 1 }, role: PermissionRole.ADMIN },
        { user: { id: 2 }, role: PermissionRole.ADMIN },
      ]);

      await expect(service.removeEmployee(1, 2, 1)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if caller tries to remove owner', async () => {
      mockPermissionRepo.find.mockResolvedValue([
        { user: { id: 1 }, role: PermissionRole.ADMIN },
        { user: { id: 2 }, role: PermissionRole.OWNER },
      ]);

      await expect(service.removeEmployee(1, 2, 1)).rejects.toThrow(ForbiddenException);
    });

    it('should remove employee from subscription and delete user permissions', async () => {
      const targetPermission = { id: 100, user: { id: 2 }, role: PermissionRole.EDITOR };
      const sub = { id: 5, users: [{ id: 1 }, { id: 2 }] };
      mockPermissionRepo.find.mockResolvedValue([
        { user: { id: 1 }, role: PermissionRole.OWNER },
        targetPermission,
      ]);
      mockSubscriptionRepo.findOne.mockResolvedValue(sub);
      mockSubscriptionRepo.save.mockResolvedValue({});
      mockPermissionRepo.remove.mockResolvedValue({});

      const result = await service.removeEmployee(1, 2, 1);

      expect(sub.users).toEqual([{ id: 1 }]);
      expect(mockSubscriptionRepo.save).toHaveBeenCalledWith(sub);
      expect(mockPermissionRepo.remove).toHaveBeenCalledWith(targetPermission);
      expect(result).toEqual({ success: true });
    });
  });
});
