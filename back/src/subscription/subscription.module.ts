import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from 'rxjs';
import { Company } from 'src/company/company.entity';
import { RawMaterial } from 'src/raw-material/raw-material.entity';
import { Recipe } from 'src/recipe/recipe.entity';
import { Platoon } from 'src/platoon/platoon.entity';
import { Invetory } from 'src/invetory/invetory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Subscription,
      Company,
      RawMaterial,
      Recipe,
      Platoon,
      Invetory,
    ]),
  ],

  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
