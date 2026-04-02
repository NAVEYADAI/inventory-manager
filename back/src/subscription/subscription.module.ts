import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { Subscription } from './subscription.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription]), AuthModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [TypeOrmModule],
})
export class SubscriptionModule {}
