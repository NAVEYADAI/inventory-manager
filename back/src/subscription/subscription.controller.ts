import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('subscription')
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.create(createSubscriptionDto);
  }

  // return subscriptions for the authenticated user
  @Get('user')
  async mySubscriptions(@Headers('authorization') authHeader: string) {
    const user = await this.authService.validateToken(authHeader);
    return this.subscriptionService.findByUserId((user as any).id);
  }

  @Get()
  findAll() {
    return this.subscriptionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscriptionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubscriptionDto: UpdateSubscriptionDto) {
    return this.subscriptionService.update(+id, updateSubscriptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionService.remove(+id);
  }

  // activate an existing subscription and return selected company info
  @Post(':id/activate')
  async activate(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ) {
    const user = await this.authService.validateToken(authHeader);
    const sub = await this.subscriptionService.activateForUser(+id, (user as any).id);
    // after activation, mimic selectCompany response (including new token)
    const result = await this.authService.selectCompany((user as any).id, sub.id);
    return { ...result, message: 'Subscription activated' };
  }
}
