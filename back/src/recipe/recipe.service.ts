import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './recipe.entity';
import { Subscription } from '../subscription/subscription.entity';
import { RawMaterial } from '../raw-material/raw-material.entity';
import { RecipeProduct } from '../recipe-product/recipe-product.entity';
import { MeasurementType } from '../enums';

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
    const { name, subscriptionId, ingredients, yieldType, isIntermediate } = createRecipeDto;

    const subscription = await this.subscriptionRepo.findOne({ where: { id: subscriptionId } });
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    const recipe = this.recipeRepo.create({
      name,
      subscription: { id: subscriptionId } as any,
      is_deleted: false,
      yieldType: yieldType ?? 'WEIGHT',
      isIntermediate: isIntermediate ?? false,
    });
    const savedRecipe = await this.recipeRepo.save(recipe);

    // Sync intermediate raw material
    await this.syncIntermediateRawMaterial(savedRecipe, name, subscription);

    const recipeProducts: RecipeProduct[] = [];
    for (const ing of ingredients) {
      const rawMaterial = await this.rawMaterialRepo.findOne({ where: { id: ing.rawMaterialId } });
      if (!rawMaterial) {
        throw new NotFoundException(`Raw material with ID ${ing.rawMaterialId} not found`);
      }

      const recipeProduct = this.recipeProductRepo.create({
        volume: ing.volume,
        uom: ing.uom,
        customUom: ing.customUom,
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
    const recipes = await this.recipeRepo.find({
      where: {
        subscription: { id: subscriptionId },
        is_deleted: false,
      },
      relations: ['recipe_product', 'recipe_product.raw_material', 'recipe_product.raw_material.conversions'],
      order: { id: 'DESC' },
    });
    
    // Sort ingredients by id ascending to guarantee drag-and-drop order
    recipes.forEach((recipe) => {
      if (recipe.recipe_product) {
        recipe.recipe_product.sort((a, b) => a.id - b.id);
      }
    });
    
    return recipes;
  }

  async findOne(id: number) {
    const recipe = await this.recipeRepo.findOne({
      where: { id, is_deleted: false },
      relations: ['recipe_product', 'recipe_product.raw_material', 'recipe_product.raw_material.conversions'],
    });
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }
    
    // Sort ingredients by id ascending to guarantee drag-and-drop order
    if (recipe.recipe_product) {
      recipe.recipe_product.sort((a, b) => a.id - b.id);
    }
    
    return recipe;
  }

  async update(id: number, updateRecipeDto: UpdateRecipeDto) {
    const recipe = await this.recipeRepo.findOne({
      where: { id, is_deleted: false },
      relations: ['subscription'],
    });
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }

    const oldName = recipe.name;
    if (updateRecipeDto.name) {
      recipe.name = updateRecipeDto.name;
    }

    if (updateRecipeDto.yieldType) {
      recipe.yieldType = updateRecipeDto.yieldType;
    }

    if (updateRecipeDto.isIntermediate !== undefined) {
      recipe.isIntermediate = updateRecipeDto.isIntermediate;
    }

    const savedRecipe = await this.recipeRepo.save(recipe);

    // Sync intermediate raw material
    await this.syncIntermediateRawMaterial(savedRecipe, oldName, savedRecipe.subscription);

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
          customUom: ing.customUom,
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
    const recipe = await this.recipeRepo.findOne({ where: { id }, relations: ['subscription'] });
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }
    recipe.is_deleted = true;
    const savedRecipe = await this.recipeRepo.save(recipe);

    // If deleted, remove corresponding raw material if it exists
    if (savedRecipe.subscription) {
      const rawMaterial = await this.rawMaterialRepo.findOne({
        where: {
          name: savedRecipe.name,
          category: 'מתכון משנה',
          subscription: { id: savedRecipe.subscription.id },
        }
      });
      if (rawMaterial) {
        await this.rawMaterialRepo.remove(rawMaterial);
      }
    }

    return { success: true };
  }

  private async syncIntermediateRawMaterial(recipe: Recipe, oldName: string, subscription: Subscription) {
    if (!subscription) return;
    
    if (recipe.isIntermediate) {
      // Find the raw material using the old name
      let rawMaterial = await this.rawMaterialRepo.findOne({
        where: {
          name: oldName,
          category: 'מתכון משנה',
          subscription: { id: subscription.id },
        }
      });

      if (!rawMaterial) {
        rawMaterial = this.rawMaterialRepo.create({
          name: recipe.name,
          category: 'מתכון משנה',
          measurementType: recipe.yieldType === 'UNITS' ? MeasurementType.COUNT : MeasurementType.WEIGHT,
          uom: recipe.yieldType === 'UNITS' ? 'piece' : 'gram',
          subscription: subscription,
        });
      } else {
        // Update the name and properties
        rawMaterial.name = recipe.name;
        rawMaterial.measurementType = recipe.yieldType === 'UNITS' ? MeasurementType.COUNT : MeasurementType.WEIGHT;
        rawMaterial.uom = recipe.yieldType === 'UNITS' ? 'piece' : 'gram';
      }
      await this.rawMaterialRepo.save(rawMaterial);
    } else {
      // If isIntermediate is false, delete the corresponding RawMaterial if it exists under oldName or current name
      const rawMaterial = await this.rawMaterialRepo.findOne({
        where: {
          name: oldName,
          category: 'מתכון משנה',
          subscription: { id: subscription.id },
        }
      });
      if (rawMaterial) {
        await this.rawMaterialRepo.remove(rawMaterial);
      }
    }
  }
}
