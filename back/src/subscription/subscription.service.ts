import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './subscription.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
  ) {}

  async findByUserId(userId: number) {
    return this.subscriptionRepo.find({
      where: { users: { id: userId } },
      relations: ['company'],
    });
  }

  async activateForUser(subscriptionId: number, userId: number) {
    const sub = await this.subscriptionRepo.findOne({
      where: { id: subscriptionId, users: { id: userId } },
      relations: ['company'],
    });
    if (!sub) {
      throw new NotFoundException('Subscription not found');
    }
    sub.is_active = true;
    await this.subscriptionRepo.save(sub);
    return sub;
  }

  // existing placeholders can remain if unused
  create(createSubscriptionDto: CreateSubscriptionDto) {
    return 'This action adds a new subscription';
  }

  findAll() {
    return `This action returns all subscription`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subscription`;
  }

  update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    return `This action updates a #${id} subscription`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscription`;
  }
}
