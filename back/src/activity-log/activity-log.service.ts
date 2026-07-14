import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog, ActivityCategory, ActivityAction } from './activity-log.entity';
import { User } from '../user/user.entity';
import { Subscription } from '../subscription/subscription.entity';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogRepo: Repository<ActivityLog>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
  ) {}

  async log(
    subscriptionId: number,
    userId: number | undefined,
    action: ActivityAction,
    category: ActivityCategory,
    details: string,
  ) {
    const subscription = await this.subscriptionRepo.findOne({ where: { id: subscriptionId } });
    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${subscriptionId} not found`);
    }

    const logEntry = new ActivityLog();
    logEntry.subscription = subscription;
    logEntry.action = action;
    logEntry.category = category;
    logEntry.details = details;

    if (userId) {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (user) {
        logEntry.user = user;
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
        logEntry.userName = fullName || user.name;
      }
    } else {
      logEntry.userName = 'מערכת';
    }

    return this.activityLogRepo.save(logEntry);
  }

  async findAllForSubscription(subscriptionId: number) {
    return this.activityLogRepo.find({
      where: { subscription: { id: subscriptionId } },
      relations: ['user'],
      order: { createdTime: 'DESC' },
    });
  }

  async findWorkManagementLogsForSubscription(subscriptionId: number) {
    return this.activityLogRepo.find({
      where: {
        subscription: { id: subscriptionId },
        category: ActivityCategory.WORK_MANAGEMENT,
      },
      relations: ['user'],
      order: { createdTime: 'DESC' },
    });
  }
}

