import { Module } from '@nestjs/common';
import { RawMaterialService } from './raw-material.service';
import { RawMaterialController } from './raw-material.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RawMaterial } from './raw-material.entity';
import { Subscription } from 'src/subscription/subscription.entity';
import { Invetory } from 'src/invetory/invetory.entity';
import { RecipeProduct } from 'src/recipe-product/recipe-product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RawMaterial,
      Subscription,
      Invetory,
      RecipeProduct,
    ]),
  ],
  controllers: [RawMaterialController],
  providers: [RawMaterialService],
})
export class RawMaterialModule {}
