import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecipeProductService } from './recipe-product.service';
import { CreateRecipeProductDto } from './dto/create-recipe-product.dto';
import { UpdateRecipeProductDto } from './dto/update-recipe-product.dto';

@Controller('recipe-product')
export class RecipeProductController {
  constructor(private readonly recipeProductService: RecipeProductService) {}

  @Post()
  create(@Body() createRecipeProductDto: CreateRecipeProductDto) {
    return this.recipeProductService.create(createRecipeProductDto);
  }

  @Get()
  findAll() {
    return this.recipeProductService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipeProductService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecipeProductDto: UpdateRecipeProductDto) {
    return this.recipeProductService.update(+id, updateRecipeProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recipeProductService.remove(+id);
  }
}
