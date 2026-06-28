import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProduct } from './create-product.entity';
import { Recipe } from '../recipe/recipe.entity';
import { CreateCreateProductDto } from './dto/create-create-product.dto';
import { UpdateCreateProductDto } from './dto/update-create-product.dto';

@Injectable()
export class CreateProductService {
  constructor(
    @InjectRepository(CreateProduct)
    private readonly createProductRepo: Repository<CreateProduct>,
    @InjectRepository(Recipe)
    private readonly recipeRepo: Repository<Recipe>,
  ) {}

  async create(createCreateProductDto: CreateCreateProductDto, userId?: number) {
    const { recipeId, batche_count, created_time, actualYield } = createCreateProductDto;
    const recipe = await this.recipeRepo.findOne({ where: { id: recipeId } });
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

    return this.createProductRepo.save(event);
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

  async update(id: number, updateCreateProductDto: UpdateCreateProductDto) {
    const event = await this.findOne(id);
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
    return this.createProductRepo.save(event);
  }

  async remove(id: number) {
    const event = await this.findOne(id);
    await this.createProductRepo.remove(event);
    return { id, deleted: true };
  }
}
