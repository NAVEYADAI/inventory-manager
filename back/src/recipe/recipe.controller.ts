import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Headers } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { AuthService } from '../auth/auth.service';

@Controller('recipe')
export class RecipeController {
  constructor(
    private readonly recipeService: RecipeService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async create(
    @Headers('authorization') authHeader: string,
    @Body() createRecipeDto: CreateRecipeDto,
  ) {
    let userId: number | undefined;
    if (authHeader) {
      try {
        const user = await this.authService.validateToken(authHeader);
        userId = user.id;
      } catch (e) {
        // ignore
      }
    }
    return this.recipeService.create(createRecipeDto, userId);
  }

  @Get()
  findAll(@Query('subscriptionId') subscriptionId?: string) {
    if (subscriptionId) {
      return this.recipeService.findAllForSubscription(+subscriptionId);
    }
    return this.recipeService.findAllForSubscription(0);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipeService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Headers('authorization') authHeader: string,
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    let userId: number | undefined;
    if (authHeader) {
      try {
        const user = await this.authService.validateToken(authHeader);
        userId = user.id;
      } catch (e) {
        // ignore
      }
    }
    return this.recipeService.update(+id, updateRecipeDto, userId);
  }

  @Delete(':id')
  async remove(
    @Headers('authorization') authHeader: string,
    @Param('id') id: string,
  ) {
    let userId: number | undefined;
    if (authHeader) {
      try {
        const user = await this.authService.validateToken(authHeader);
        userId = user.id;
      } catch (e) {
        // ignore
      }
    }
    return this.recipeService.remove(+id, userId);
  }
}

