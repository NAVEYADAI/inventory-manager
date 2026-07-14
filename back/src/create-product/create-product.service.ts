import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProduct } from './create-product.entity';
import { Recipe } from '../recipe/recipe.entity';
import { CreateCreateProductDto } from './dto/create-create-product.dto';
import { UpdateCreateProductDto } from './dto/update-create-product.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { ActivityCategory, ActivityAction } from '../activity-log/activity-log.entity';

@Injectable()
export class CreateProductService {
  constructor(
    @InjectRepository(CreateProduct)
    private readonly createProductRepo: Repository<CreateProduct>,
    @InjectRepository(Recipe)
    private readonly recipeRepo: Repository<Recipe>,
    private readonly activityLogService: ActivityLogService,
  ) {}


  async create(createCreateProductDto: CreateCreateProductDto, userId?: number) {
    const { recipeId, batche_count, created_time, actualYield } = createCreateProductDto;
    const recipe = await this.recipeRepo.findOne({ where: { id: recipeId }, relations: ['subscription'] });
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${recipeId} not found`);
    }

    const event = new CreateProduct();
    event.recipe = recipe;
    event.batche_count = batche_count;
    event.created_time = new Date(created_time);
    event.updated_time = new Date();
    event.actualYield = actualYield;
    if (userId) {
      event.createdBy = { id: userId } as any;
    }

    const saved = await this.createProductRepo.save(event);

    try {
      if (recipe.subscription) {
        const yieldDesc = actualYield !== undefined && actualYield !== null
          ? ` (נתקבל בפועל: ${actualYield} ${recipe.yieldType === 'UNITS' ? 'יחידות' : 'ק״ג/גרם'})`
          : '';
        await this.activityLogService.log(
          recipe.subscription.id,
          userId,
          ActivityAction.EXECUTE_RECIPE,
          ActivityCategory.WORK_MANAGEMENT,
          `בוצעה הכנה של מתכון: ${recipe.name}, כפול ${batche_count} מנות${yieldDesc}`,
        );
      }
    } catch (e) {
      // ignore
    }

    return saved;
  }

  async findAllForSubscription(subscriptionId: number) {
    return this.createProductRepo.find({
      where: {
        recipe: {
          subscription: { id: subscriptionId },
        },
      },
      relations: ['recipe', 'recipe.recipe_product', 'recipe.recipe_product.raw_material', 'createdBy'],
      order: {
        created_time: 'DESC',
      },
    });
  }

  async findAll() {
    return this.createProductRepo.find({ relations: ['recipe'] });
  }

  async findOne(id: number) {
    const event = await this.createProductRepo.findOne({
      where: { id },
      relations: ['recipe', 'recipe.recipe_product', 'recipe.recipe_product.raw_material', 'createdBy'],
    });
    if (!event) {
      throw new NotFoundException(`CreateProduct event with ID ${id} not found`);
    }
    return event;
  }

  async update(id: number, updateCreateProductDto: UpdateCreateProductDto, userId?: number) {
    const event = await this.createProductRepo.findOne({
      where: { id },
      relations: ['recipe', 'recipe.subscription'],
    });
    if (!event) {
      throw new NotFoundException(`CreateProduct event with ID ${id} not found`);
    }
    if (updateCreateProductDto.batche_count !== undefined) {
      event.batche_count = updateCreateProductDto.batche_count;
    }
    if (updateCreateProductDto.created_time !== undefined) {
      event.created_time = new Date(updateCreateProductDto.created_time);
    }
    if (updateCreateProductDto.actualYield !== undefined) {
      event.actualYield = updateCreateProductDto.actualYield;
    }
    event.updated_time = new Date();
    const saved = await this.createProductRepo.save(event);

    try {
      if (saved.recipe?.subscription) {
        const yieldDesc = saved.actualYield !== undefined && saved.actualYield !== null
          ? `לכמות ${saved.actualYield} ${saved.recipe.yieldType === 'UNITS' ? 'יחידות' : 'ק״ג/גרם'}`
          : 'לערך ריק';
        await this.activityLogService.log(
          saved.recipe.subscription.id,
          userId,
          ActivityAction.UPDATE_EXECUTION_YIELD,
          ActivityCategory.WORK_MANAGEMENT,
          `עודכנה כמות יציאה בפועל של הכנת מתכון ${saved.recipe.name}: ${yieldDesc}`,
        );
      }
    } catch (e) {
      // ignore
    }

    return saved;
  }

  async remove(id: number, userId?: number) {
    const event = await this.createProductRepo.findOne({
      where: { id },
      relations: ['recipe', 'recipe.subscription'],
    });
    if (!event) {
      throw new NotFoundException(`CreateProduct event with ID ${id} not found`);
    }
    await this.createProductRepo.remove(event);

    try {
      if (event.recipe?.subscription) {
        await this.activityLogService.log(
          event.recipe.subscription.id,
          userId,
          ActivityAction.DELETE_EXECUTION,
          ActivityCategory.WORK_MANAGEMENT,
          `בוטלה/נמחקה הכנת מתכון: ${event.recipe.name}`,
        );
      }
    } catch (e) {
      // ignore
    }

    return { id, deleted: true };
  }
}
