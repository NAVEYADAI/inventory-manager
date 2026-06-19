import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateProduct } from './create-product.entity';
import { Recipe } from '../recipe/recipe.entity';
import { CreateProductService } from './create-product.service';
import { CreateProductController } from './create-product.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CreateProduct, Recipe])],
  controllers: [CreateProductController],
  providers: [CreateProductService],
})
export class CreateProductModule {}
