import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './recipe.entity';
import { Subscription } from '../subscription/subscription.entity';
import { RawMaterial } from '../raw-material/raw-material.entity';
import { RecipeProduct } from '../recipe-product/recipe-product.entity';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepo: Repository<Recipe>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
    @InjectRepository(RawMaterial)
    private readonly rawMaterialRepo: Repository<RawMaterial>,
    @InjectRepository(RecipeProduct)
    private readonly recipeProductRepo: Repository<RecipeProduct>,
  ) {}

  async create(createRecipeDto: CreateRecipeDto) {
    const { name, subscriptionId, ingredients } = createRecipeDto;

    const subscription = await this.subscriptionRepo.findOne({ where: { id: subscriptionId } });
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    const recipe = this.recipeRepo.create({
      name,
      subscription: { id: subscriptionId } as any,
      is_deleted: false,
    });
    const savedRecipe = await this.recipeRepo.save(recipe);

    const recipeProducts: RecipeProduct[] = [];
    for (const ing of ingredients) {
      const rawMaterial = await this.rawMaterialRepo.findOne({ where: { id: ing.rawMaterialId } });
      if (!rawMaterial) {
        throw new NotFoundException(`Raw material with ID ${ing.rawMaterialId} not found`);
      }

      const recipeProduct = this.recipeProductRepo.create({
        volume: ing.volume,
        uom: ing.uom,
        raw_material: { id: ing.rawMaterialId } as any,
        recipe: savedRecipe,
      });
      recipeProducts.push(recipeProduct);
    }

    await this.recipeProductRepo.save(recipeProducts);

    savedRecipe.recipe_product = recipeProducts;
    return savedRecipe;
  }

  async findAllForSubscription(subscriptionId: number) {
    return await this.recipeRepo.find({
      where: {
        subscription: { id: subscriptionId },
        is_deleted: false,
      },
      relations: ['recipe_product', 'recipe_product.raw_material'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const recipe = await this.recipeRepo.findOne({
      where: { id, is_deleted: false },
      relations: ['recipe_product', 'recipe_product.raw_material'],
    });
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }
    return recipe;
  }

  async update(id: number, updateRecipeDto: UpdateRecipeDto) {
    const recipe = await this.recipeRepo.findOne({ where: { id, is_deleted: false } });
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }

    if (updateRecipeDto.name) {
      recipe.name = updateRecipeDto.name;
    }

    const savedRecipe = await this.recipeRepo.save(recipe);

    if (updateRecipeDto.ingredients) {
      await this.recipeProductRepo.delete({ recipe: { id } });

      const recipeProducts: RecipeProduct[] = [];
      for (const ing of updateRecipeDto.ingredients) {
        const rawMaterial = await this.rawMaterialRepo.findOne({ where: { id: ing.rawMaterialId } });
        if (!rawMaterial) {
          throw new NotFoundException(`Raw material with ID ${ing.rawMaterialId} not found`);
        }
        const recipeProduct = this.recipeProductRepo.create({
          volume: ing.volume,
          uom: ing.uom,
          raw_material: { id: ing.rawMaterialId } as any,
          recipe: savedRecipe,
        });
        recipeProducts.push(recipeProduct);
      }
      await this.recipeProductRepo.save(recipeProducts);
      savedRecipe.recipe_product = recipeProducts;
    }

    return savedRecipe;
  }

  async remove(id: number) {
    const recipe = await this.recipeRepo.findOne({ where: { id } });
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }
    recipe.is_deleted = true;
    await this.recipeRepo.save(recipe);
    return { success: true };
  }
}
