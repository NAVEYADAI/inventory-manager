import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './recipe.entity';
import { Subscription } from 'src/subscription/subscription.entity';
import { RecipeProduct } from 'src/recipe-product/recipe-product.entity';
import { CreateProduct } from 'src/create-product/create-product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Recipe,
      Subscription,
      RecipeProduct,
      CreateProduct,
    ]),
  ],

  controllers: [RecipeController],
  providers: [RecipeService],
})
export class RecipeModule {}
