import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register-auth.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { LoginDto } from './dto/login-auth.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(dto: RegisterDto) {
    const existing = await this.userService.findByUserName(dto.name);
    if (existing) throw new ConflictException('User already exists');
    const user = await this.userService.create({
      userName: dto.name,
      firstName: '',
      lastName: '',
      address: '',
      phone: '',
      email: dto.email,
      password: dto.password,
    });
    return { id: (user as any).id, email: (user as any).email, name: (user as any).name };
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByUserName(dto.userName); 
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const pwd = await this.userService.getLatestPasswordForUser((user as any).id);
    const hash = pwd?.hash;
    if (!hash) throw new UnauthorizedException('Invalid credentials');
    const match = await bcrypt.compare(dto.password, hash);
    if (!match) throw new UnauthorizedException('Invalid credentials');
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const token = jwt.sign({ sub: (user as any).id, email: (user as any).email }, secret, { expiresIn: '7d' });
    return { accessToken: token, user: { id: (user as any).id, email: (user as any).email, name: (user as any).name } };
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
}
