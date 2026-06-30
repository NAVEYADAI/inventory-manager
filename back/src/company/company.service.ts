import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Company } from './company.entity';
import { Subscription } from 'src/subscription/subscription.entity';
import { User } from 'src/user/user.entity';
import { UserPermission, PermissionRole } from 'src/use-permissions/use-permission.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserPermission)
    private readonly permissionRepo: Repository<UserPermission>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Create a company. if ownerId is provided we also create a subscription
   * linking the given user to the new company.
   */
async create(createCompanyDto: CreateCompanyDto): Promise<{ company: Company; subscription: Subscription | null }> {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      
      // יצירת מופעי רפוזיטורי שמחוברים לטרנזקציה הנוכחית
      const txCompanyRepo = manager.withRepository(this.companyRepo);
      const txSubscriptionRepo = manager.withRepository(this.subscriptionRepo);
      const txUserRepo = manager.withRepository(this.userRepo);
      const { ownerId, ...companyData } = createCompanyDto;

      const existingCompany = await txCompanyRepo.findOne({
        where: {
          name: companyData.name,
          identifier: companyData.identifier || '',
        },
      });
      if (existingCompany) {
        throw new ConflictException('חברה עם שם ומזהה אלו כבר קיימת במערכת');
      }

      const company = txCompanyRepo.create(companyData);
      const savedCompany = await txCompanyRepo.save(company);
      let subscriptionResult = null;
      if (ownerId) {
        const user = await txUserRepo.findOne({ where: { id: ownerId } });
        
        if (!user) {
          throw new NotFoundException(`Owner user with ID ${ownerId} not found`);
        }
        const subscription = txSubscriptionRepo.create({
          company: savedCompany,
          users: [user],
        });
        subscriptionResult = await txSubscriptionRepo.save(subscription);

        const txPermissionRepo = manager.withRepository(this.permissionRepo);
        const permission = txPermissionRepo.create({
          user,
          company: savedCompany,
          role: PermissionRole.OWNER,
        });
        await txPermissionRepo.save(permission);
      }
      
      return { company: savedCompany, subscription: subscriptionResult };
    });
  }

  findAll() {
    return `This action returns all company`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }

  async findCompanyEmployees(companyId: number) {
    return this.permissionRepo.find({
      where: { company: { id: companyId } },
      relations: ['user'],
    });
  }

  async registerEmployee(companyId: number, dto: any) {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      const txSubscriptionRepo = manager.withRepository(this.subscriptionRepo);
      const txPermissionRepo = manager.withRepository(this.permissionRepo);
      const txUserRepo = manager.withRepository(this.userRepo);

      // Check if username/email already exists
      let user = await txUserRepo.findOne({ where: { name: dto.name } });
      let isNewUser = false;

      if (!user) {
        user = await txUserRepo.findOne({ where: { email: dto.email } });
      }

      if (user) {
        // User exists! Check if they are already in the subscription for this company
        const subscription = await txSubscriptionRepo.findOne({
          where: { company: { id: companyId }, users: { id: user.id } },
        });
        if (subscription) {
          throw new Error('העובד כבר רשום בחברה זו');
        }
      } else {
        isNewUser = true;
        // 1. Create the new user
        user = txUserRepo.create({
          name: dto.name ?? dto.email,
          firstName: dto.firstName ?? '',
          lastName: dto.lastName ?? '',
          address: dto.address ?? '',
          phone: dto.phone ?? '',
          email: dto.email,
        });
        user = await txUserRepo.save(user);

        // Hash password and save Password entity
        const bcrypt = require('bcryptjs');
        const hash = await bcrypt.hash(dto.password, 10);
        const passwordRepo = manager.getRepository('Password');
        const pwd = passwordRepo.create({
          password: '',
          hash,
          date: new Date(),
          user: user,
        });
        await passwordRepo.save(pwd);
      }

      // 2. Associate with subscription
      const subscription = await txSubscriptionRepo.findOne({
        where: { company: { id: companyId } },
        relations: ['users'],
      });
      if (!subscription) {
        throw new NotFoundException('Subscription for this company not found');
      }
      subscription.users = subscription.users || [];
      if (!subscription.users.some(u => u.id === user.id)) {
        subscription.users.push(user);
        await txSubscriptionRepo.save(subscription);
      }

      // 3. Create or update UserPermission
      let permission = await txPermissionRepo.findOne({
        where: { user: { id: user.id }, company: { id: companyId } }
      });
      if (!permission) {
        permission = txPermissionRepo.create({
          user,
          company: { id: companyId } as any,
          role: dto.role || PermissionRole.EDITOR,
        });
        await txPermissionRepo.save(permission);
      } else {
        permission.role = dto.role || PermissionRole.EDITOR;
        await txPermissionRepo.save(permission);
      }

      return { user, isNewUser };
    });
  }

  async updateEmployeeRole(companyId: number, targetUserId: number, newRole: string, callerId: number) {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      const txPermissionRepo = manager.withRepository(this.permissionRepo);

      // 1. Get all employees in company to find caller and target
      const permissions = await txPermissionRepo.find({
        where: { company: { id: companyId } },
        relations: ['user'],
      });

      const callerPermission = permissions.find(p => p.user.id === callerId);
      if (!callerPermission) {
        throw new ForbiddenException('Caller is not a member of this company');
      }

      const targetPermission = permissions.find(p => p.user.id === targetUserId);
      if (!targetPermission) {
        throw new NotFoundException('Target employee not found in this company');
      }

      // 2. Validate role hierarchy
      const callerRole = callerPermission.role;
      const currentTargetRole = targetPermission.role;

      if (callerRole !== PermissionRole.OWNER && callerRole !== PermissionRole.ADMIN) {
        throw new ForbiddenException('Only owners and managers can modify roles');
      }

      if (callerId === targetUserId) {
        throw new ForbiddenException('You cannot modify your own role');
      }

      if (currentTargetRole === PermissionRole.OWNER) {
        throw new ForbiddenException('Cannot modify the role of the owner');
      }

      if (callerRole === PermissionRole.ADMIN) {
        // Admin cannot modify roles of other admins, and can only set roles to editor/viewer
        if (currentTargetRole === PermissionRole.ADMIN) {
          throw new ForbiddenException('Managers cannot modify other managers');
        }
        if (newRole !== PermissionRole.EDITOR && newRole !== PermissionRole.VIEWER) {
          throw new ForbiddenException('Managers can only assign editor or viewer roles');
        }
      }

      if (newRole === PermissionRole.OWNER) {
        throw new ForbiddenException('Cannot assign the owner role');
      }

      // 3. Update the role
      targetPermission.role = newRole as PermissionRole;
      return await txPermissionRepo.save(targetPermission);
    });
  }

  async removeEmployee(companyId: number, targetUserId: number, callerId: number) {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      const txPermissionRepo = manager.withRepository(this.permissionRepo);
      const txSubscriptionRepo = manager.withRepository(this.subscriptionRepo);

      // 1. Validate caller and target
      const permissions = await txPermissionRepo.find({
        where: { company: { id: companyId } },
        relations: ['user'],
      });

      const callerPermission = permissions.find(p => p.user.id === callerId);
      if (!callerPermission) {
        throw new ForbiddenException('Caller is not a member of this company');
      }

      const targetPermission = permissions.find(p => p.user.id === targetUserId);
      if (!targetPermission) {
        throw new NotFoundException('Target employee not found in this company');
      }

      const callerRole = callerPermission.role;
      const targetRole = targetPermission.role;

      if (callerRole !== PermissionRole.OWNER && callerRole !== PermissionRole.ADMIN) {
        throw new ForbiddenException('Only owners and managers can remove employees');
      }

      if (callerId === targetUserId) {
        throw new ForbiddenException('You cannot remove yourself');
      }

      if (targetRole === PermissionRole.OWNER) {
        throw new ForbiddenException('Cannot remove the owner of the company');
      }

      if (callerRole === PermissionRole.ADMIN && targetRole === PermissionRole.ADMIN) {
        throw new ForbiddenException('Managers cannot remove other managers');
      }

      // 2. Remove from subscription
      const subscription = await txSubscriptionRepo.findOne({
        where: { company: { id: companyId } },
        relations: ['users'],
      });
      if (subscription) {
        subscription.users = subscription.users.filter(u => u.id !== targetUserId);
        await txSubscriptionRepo.save(subscription);
      }

      // 3. Delete the UserPermission record
      await txPermissionRepo.remove(targetPermission);
      return { success: true };
    });
  }
}
