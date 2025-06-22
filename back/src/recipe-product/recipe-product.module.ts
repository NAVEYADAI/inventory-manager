import { Module } from '@nestjs/common';
import { RecipeProductService } from './recipe-product.service';
import { RecipeProductController } from './recipe-product.controller';

@Module({
  controllers: [RecipeProductController],
  providers: [RecipeProductService],
})
export class RecipeProductModule {}
