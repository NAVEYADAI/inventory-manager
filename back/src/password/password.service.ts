import { Injectable } from '@nestjs/common';
import { CreatePasswordDto } from './dto/create-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Password } from './password.entity';
import { User } from 'src/user/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PasswordService {
  constructor(
    @InjectRepository(Password)
    private readonly passwordRepo: Repository<Password>,
  ) {}

  async createPassword(user: User, plainPassword: string): Promise<Password> {
    const hash = await bcrypt.hash(plainPassword, 12);
    const password = this.passwordRepo.create({
      password: plainPassword,
      hash,
      date: new Date(),
      user,
    });
    return this.passwordRepo.save(password);
  }
  async validatePassword(
    plainPassword: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hash);
  }

  async changePassword(user: User, newPassword: string): Promise<Password> {
    const hash = await bcrypt.hash(newPassword, 12);
    const password = this.passwordRepo.create({
      password: newPassword,
      hash,
      date: new Date(),
      user,
    });
    return this.passwordRepo.save(password);
  }

  create(createPasswordDto: CreatePasswordDto) {
    return 'This action adds a new password';
  }

  findAll() {
    return `This action returns all password`;
  }

  findOne(id: number) {
    return `This action returns a #${id} password`;
  }

  update(id: number, updatePasswordDto: UpdatePasswordDto) {
    return `This action updates a #${id} password`;
  }

  remove(id: number) {
    return `This action removes a #${id} password`;
  }
}
