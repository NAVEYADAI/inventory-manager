import { Injectable } from '@nestjs/common';
import { CreateRecipeProductDto } from './dto/create-recipe-product.dto';
import { UpdateRecipeProductDto } from './dto/update-recipe-product.dto';

@Injectable()
export class RecipeProductService {
  create(createRecipeProductDto: CreateRecipeProductDto) {
    return 'This action adds a new recipeProduct';
  }

  findAll() {
    return `This action returns all recipeProduct`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recipeProduct`;
  }

  update(id: number, updateRecipeProductDto: UpdateRecipeProductDto) {
    return `This action updates a #${id} recipeProduct`;
  }

  remove(id: number) {
    return `This action removes a #${id} recipeProduct`;
  }
}
