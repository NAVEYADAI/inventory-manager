import { Module } from '@nestjs/common';
import { RecipeProductService } from './recipe-product.service';
import { RecipeProductController } from './recipe-product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeProduct } from './recipe-product.entity';
import { Recipe } from 'src/recipe/recipe.entity';
import { RawMaterial } from 'src/raw-material/raw-material.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeProduct, Recipe, RawMaterial])],
  controllers: [RecipeProductController],
  providers: [RecipeProductService],
})
export class RecipeProductModule {}
