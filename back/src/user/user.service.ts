import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Password } from 'src/password/password.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Password)
    private readonly passwordRepo: Repository<Password>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepo.create({
      name: createUserDto.userName ?? createUserDto.email,
      firstName: createUserDto.firstName ?? '',
      lastName: createUserDto.lastName ?? '',
      address: createUserDto.address ?? '',
      phone: createUserDto.phone ?? '',
      email: createUserDto.email,
    });
    const saved = await this.userRepo.save(user);

    const hash = await bcrypt.hash(createUserDto.password, 10);
    const pwd = this.passwordRepo.create({
      password: '',
      hash,
      date: new Date(),
      user: saved,
    });
    await this.passwordRepo.save(pwd);

    return saved;
  }

  async findAll() {
    return this.userRepo.find();
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  async findByUserName(userName: string) {
    return this.userRepo.findOne({ where: { name: userName } });
  }

  async getLatestPasswordForUser(userId: number) {
    return this.passwordRepo.findOne({
      where: { user: { id: userId } as any },
      order: { date: 'DESC' },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepo.update(id, updateUserDto as any);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.userRepo.delete(id);
    return { deleted: true };
  }
}
