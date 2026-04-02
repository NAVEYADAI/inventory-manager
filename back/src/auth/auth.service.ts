import { ConflictException, Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { RegisterDto } from './dto/register-auth.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { LoginDto } from './dto/login-auth.dto';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from 'src/subscription/subscription.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
  ) { }

  async register(dto: RegisterDto) {
    const existing = await this.userService.findByUserName(dto.name);
    if (existing) throw new ConflictException('User already exists');
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

    let selectedCompany = null;
    if (activeSubs.length === 1) {
      selectedCompany = {
        id: activeSubs[0].company.id,
        name: activeSubs[0].company.name,
        subscriptionId: activeSubs[0].id,
      };
    }

    const secret = process.env.JWT_SECRET || 'dev-secret';
    const token = jwt.sign({ sub: (user as any).id, email: (user as any).email, company: selectedCompany }, secret, { expiresIn: '7d' });
    return {
      accessToken: token,
      user: {
        id: (user as any).id,
        email: (user as any).email,
        name: (user as any).name,
        activeCompanies: activeSubs.map((sub: any) => ({ id: sub.company.id, name: sub.company.name, subscriptionId: sub.id })),
        inactiveCompanies: inactiveSubs.map((sub: any) => ({ id: sub.company.id, name: sub.company.name, subscriptionId: sub.id })),
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

    const selectedCompany = {
      id: subscription.company.id,
      name: subscription.company.name,
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
    return jwt.sign(payload, secret, { expiresIn: '7d' });
  }
}
