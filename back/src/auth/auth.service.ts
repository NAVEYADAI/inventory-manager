import { Injectable } from '@nestjs/common';
import { PasswordService } from 'src/password/password.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(
    name: string,
    firstName: string,
    lastName: string,
    address: string,
    phone: string,
    email: string,
    password: string,
  ) {
    const user = await this.userService.createUser(
      name,
      firstName,
      lastName,
      address,
      phone,
      email,
    );
    await this.passwordService.createPassword(user, password);
    return user;
  }

  async signIn(email: string, plainPassword: string) {
    const user = await this.userService.findByEmail(email);
    if (!user || !user.passwords || user.passwords.length === 0)
      throw new Error('Invalid credentials');

    const latestPassword = user.passwords[user.passwords.length - 1];
    const valid = await this.passwordService.validatePassword(
      plainPassword,
      latestPassword.hash,
    );

    if (!valid) throw new Error('Invalid credentials');

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.userService.findById(userId);
    if (!user) throw new Error('User not found');

    const latestPassword = user.passwords[user.passwords.length - 1];
    const valid = await this.passwordService.validatePassword(
      oldPassword,
      latestPassword.hash,
    );
    if (!valid) throw new Error('Old password is incorrect');

    return this.passwordService.changePassword(user, newPassword);
  }
}
