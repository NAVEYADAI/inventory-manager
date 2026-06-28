import { ConflictException, Injectable, UnauthorizedException, NotFoundException, Logger } from '@nestjs/common';
import { RegisterDto } from './dto/register-auth.dto';
import * as jwt from 'jsonwebtoken';
import { LoginDto } from './dto/login-auth.dto';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from 'src/subscription/subscription.entity';
import { UserPermission, PermissionRole } from 'src/use-permissions/use-permission.entity';
const bcrypt = require('bcryptjs');
 
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
    @InjectRepository(UserPermission)
    private readonly permissionRepo: Repository<UserPermission>,
  ) { }

  async register(dto: RegisterDto) {
    const existing = await this.userService.findByUserName(dto.name);
    if (existing) {
      const subs = await this.userService.getUserCompanies(existing.id);
      if (subs.length === 0) {
        // User has no companies/subscriptions (stale registration). Delete and allow registration.
        this.logger.warn(`Deleting stale user '${existing.name}' (ID: ${existing.id}) with no active subscriptions during re-registration.`);
        await this.userService.remove(existing.id);
      } else {
        throw new ConflictException('User already exists');
      }
    }
    return await this.userService.create({
      userName: dto.name,
      firstName: dto.firstName,
      lastName: dto.lastName,
      address: dto.address,
      phone: dto.phone,
      email: dto.email,
      password: dto.password,
    });
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByUserName(dto.userName);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const pwd = await this.userService.getLatestPasswordForUser((user as any).id);
    const hash = pwd?.hash;
    if (!hash) throw new UnauthorizedException('Invalid credentials');
    const match = await bcrypt.compare(dto.password, hash);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    // Fetch user's subscriptions and split active/inactive
    const subs = await this.userService.getUserCompanies((user).id);
    const activeSubs = subs.filter((s: any) => s.is_active);
    const inactiveSubs = subs.filter((s: any) => !s.is_active);
 
    const activeCompanies = [];
    for (const sub of activeSubs) {
      let permission = await this.permissionRepo.findOne({
        where: { user: { id: user.id }, company: { id: sub.company.id } },
      });
      if (!permission) {
        permission = this.permissionRepo.create({
          user: { id: user.id } as any,
          company: { id: sub.company.id } as any,
          role: PermissionRole.ADMIN,
        });
        await this.permissionRepo.save(permission);
      }
      activeCompanies.push({ id: sub.company.id, name: sub.company.name, subscriptionId: sub.id, role: permission.role });
    }

    const inactiveCompanies = [];
    for (const sub of inactiveSubs) {
      let permission = await this.permissionRepo.findOne({
        where: { user: { id: user.id }, company: { id: sub.company.id } },
      });
      if (!permission) {
        permission = this.permissionRepo.create({
          user: { id: user.id } as any,
          company: { id: sub.company.id } as any,
          role: PermissionRole.ADMIN,
        });
        await this.permissionRepo.save(permission);
      }
      inactiveCompanies.push({ id: sub.company.id, name: sub.company.name, subscriptionId: sub.id, role: permission.role });
    }

    let selectedCompany = null;
    if (activeCompanies.length === 1) {
      selectedCompany = activeCompanies[0];
    }
 
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const token = jwt.sign({ sub: (user as any).id, email: (user as any).email, company: selectedCompany }, secret, { expiresIn: '12h' });
    return {
      accessToken: token,
      user: {
        id: (user as any).id,
        email: (user as any).email,
        name: (user as any).name,
        activeCompanies,
        inactiveCompanies,
        selectedCompany,
      },
    };
  }

  /**
   * Verify a JWT token and return the corresponding user from DB.
   * Throws UnauthorizedException when token is invalid or user not found.
   */
  async validateToken(token: string) {
    if (!token) throw new UnauthorizedException('Missing token');
    const secret = process.env.JWT_SECRET || 'dev-secret';
    let payload: any;
    try {
      payload = jwt.verify(token.replace(/^Bearer\s+/i, ''), secret);
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
    const userId = payload?.sub;
    if (!userId) throw new UnauthorizedException('Invalid token payload');
    const user = await this.userService.findOne(userId);
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  async selectCompany(userId: number, subscriptionId: number) {
    const subscription = await this.subscriptionRepo.findOne({
      where: { id: subscriptionId, users: { id: userId } },
      relations: ['company'],
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found or user does not have access');
    }

    if (!subscription.is_active) {
      throw new UnauthorizedException('This subscription is not active');
    }

    let permission = await this.permissionRepo.findOne({
      where: { user: { id: userId }, company: { id: subscription.company.id } },
    });
    if (!permission) {
      permission = this.permissionRepo.create({
        user: { id: userId } as any,
        company: { id: subscription.company.id } as any,
        role: PermissionRole.ADMIN,
      });
      await this.permissionRepo.save(permission);
    }

    const selectedCompany = {
      id: subscription.company.id,
      name: subscription.company.name,
      subscriptionId: subscription.id,
      role: permission.role,
    };
    const user = await this.userService.findOne(userId);
    const newToken = this.createTokenWithCompany(user, selectedCompany);
    return {
      accessToken: newToken,
      selectedCompany,
      subscriptionId: subscription.id,
      message: 'Company selected successfully',
    };
  }

  /**
   * Helper to create a fresh JWT token including the selected company
   */
  private createTokenWithCompany(user: any, company: any) {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const payload: any = { sub: user.id, email: user.email };
    if (company) {
      payload.company = company;
    }
    return jwt.sign(payload, secret, { expiresIn: '12h' });
  }
}
