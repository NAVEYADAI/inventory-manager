import { Module } from '@nestjs/common';
import { PlatoonService } from './platoon.service';
import { PlatoonController } from './platoon.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Platoon } from './platoon.entity';
import { Subscription } from 'src/subscription/subscription.entity';
import { Product } from 'src/product/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Platoon, Subscription, Product])],
  controllers: [PlatoonController],
  providers: [PlatoonService],
})
export class PlatoonModule {}
