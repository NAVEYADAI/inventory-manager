import { Controller, Get, Query, Headers, ForbiddenException, BadRequestException } from '@nestjs/common';
import { ActivityLogService } from './activity-log.service';
import { AuthService } from '../auth/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPermission, PermissionRole } from '../use-permissions/use-permission.entity';
import { Subscription } from '../subscription/subscription.entity';

@Controller('activity-log')
export class ActivityLogController {
  constructor(
    private readonly activityLogService: ActivityLogService,
    private readonly authService: AuthService,
    @InjectRepository(UserPermission)
    private readonly permissionRepo: Repository<UserPermission>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
  ) {}

  @Get()
  async getLogs(
    @Headers('authorization') authHeader: string,
    @Query('subscriptionId') subscriptionIdStr: string,
  ) {
    if (!subscriptionIdStr) {
      throw new BadRequestException('Missing subscriptionId parameter');
    }
    const subscriptionId = +subscriptionIdStr;

    // 1. Authenticate user
    const user = await this.authService.validateToken(authHeader);

    // 2. Load the subscription to get companyId
    const subscription = await this.subscriptionRepo.findOne({
      where: { id: subscriptionId },
      relations: ['company'],
    });
    if (!subscription || !subscription.company) {
      throw new ForbiddenException('No access to this company');
    }

    // 3. Fetch permission for this user in this subscription's company
    const permission = await this.permissionRepo.findOne({
      where: {
        user: { id: user.id },
        company: { id: subscription.company.id },
      },
    });

    if (!permission) {
      throw new ForbiddenException('No access to this company');
    }

    // 4. Apply role-based filtering
    if (permission.role === PermissionRole.OWNER) {
      // Owner gets everything (both work management and employee management)
      return this.activityLogService.findAllForSubscription(subscriptionId);
    } else if (permission.role === PermissionRole.ADMIN) {
      // Admin (manager) gets work management logs only
      return this.activityLogService.findWorkManagementLogsForSubscription(subscriptionId);
    } else {
      // Editors and Viewers have no access to activity logs
      throw new ForbiddenException('Only owners and managers are allowed to view activity logs');
    }
  }
}

