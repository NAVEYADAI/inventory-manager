import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { Recipe } from './recipe.entity';
import { Subscription } from '../subscription/subscription.entity';
import { RawMaterial } from '../raw-material/raw-material.entity';
import { RecipeProduct } from '../recipe-product/recipe-product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recipe, Subscription, RawMaterial, RecipeProduct]),
  ],
  controllers: [RecipeController],
  providers: [RecipeService],
  exports: [RecipeService],
})
export class RecipeModule {}
