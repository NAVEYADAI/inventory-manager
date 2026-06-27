import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Tag } from './tag.entity';
import { Subscription } from 'src/subscription/subscription.entity';
import { CreateProduct } from 'src/create-product/create-product.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

function convertToBase(rp: any): { volume: number; uom: string } {
  const rawMat = rp.raw_material;
  if (!rawMat) return { volume: rp.volume, uom: rp.uom };

  const targetUom = rp.uom === 'custom' || rp.uom === 'CUSTOM' ? rp.customUom : rp.uom;

  const customConversion = rawMat.conversions?.find(
    (c: any) => c.uomName === targetUom,
  );

  if (customConversion) {
    return {
      volume: rp.volume * customConversion.conversionFactor,
      uom: customConversion.baseUom || rawMat.uom || 'gram',
    };
  }

  const rpUomLower = targetUom?.toLowerCase();
  const rawUomLower = (rawMat.uom || 'gram').toLowerCase();

  if (rpUomLower === 'kilogram' && rawUomLower === 'gram') {
    return { volume: rp.volume * 1000, uom: 'gram' };
  }
  if (rpUomLower === 'gram' && rawUomLower === 'kilogram') {
    return { volume: rp.volume / 1000, uom: 'kilogram' };
  }
  if (rpUomLower === 'liter' && rawUomLower === 'milliliter') {
    return { volume: rp.volume * 1000, uom: 'milliliter' };
  }
  if (rpUomLower === 'milliliter' && rawUomLower === 'liter') {
    return { volume: rp.volume / 1000, uom: 'liter' };
  }

  return { volume: rp.volume, uom: targetUom };
}

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
    @InjectRepository(CreateProduct)
    private readonly createProductRepo: Repository<CreateProduct>,
  ) {}

  async create(createTagDto: CreateTagDto) {
    const { name, description, startDate, endDate, subscriptionId, isHidden } = createTagDto;
    const subscription = await this.subscriptionRepo.findOne({ where: { id: subscriptionId } });
    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${subscriptionId} not found`);
    }

    const tag = this.tagRepo.create({
      name,
      description: description ?? '',
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isHidden: isHidden ?? false,
      subscription,
    });

    return this.tagRepo.save(tag);
  }

  async findAllForSubscription(subscriptionId: number) {
    return this.tagRepo.find({
      where: {
        subscription: { id: subscriptionId },
      },
      order: {
        startDate: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    const tag = await this.tagRepo.findOne({
      where: { id },
      relations: ['subscription'],
    });
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    return tag;
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const tag = await this.findOne(id);
    const { name, description, startDate, endDate, isHidden } = updateTagDto;

    if (name !== undefined) tag.name = name;
    if (description !== undefined) tag.description = description;
    if (startDate !== undefined) tag.startDate = new Date(startDate);
    if (endDate !== undefined) tag.endDate = new Date(endDate);
    if (isHidden !== undefined) tag.isHidden = isHidden;

    return this.tagRepo.save(tag);
  }

  async remove(id: number) {
    const tag = await this.findOne(id);
    await this.tagRepo.remove(tag);
    return { id, deleted: true };
  }

  async getSummary(id: number) {
    const tag = await this.findOne(id);

    const start = new Date(tag.startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(tag.endDate);
    end.setHours(23, 59, 59, 999);

    const executions = await this.createProductRepo.find({
      where: {
        recipe: {
          subscription: { id: tag.subscription.id },
        },
        created_time: Between(start, end),
      },
      relations: [
        'recipe',
        'recipe.recipe_product',
        'recipe.recipe_product.raw_material',
        'recipe.recipe_product.raw_material.conversions',
      ],
    });

    const recipesSummary = new Map<number, { id: number; name: string; totalBatches: number; executionCount: number }>();
    const rawMaterialsSummary = new Map<number, { id: number; name: string; volume: number; uom: string }>();

    for (const exec of executions) {
      const recipe = exec.recipe;
      if (!recipe) continue;

      const batchCount = exec.batche_count || 1;

      if (!recipesSummary.has(recipe.id)) {
        recipesSummary.set(recipe.id, {
          id: recipe.id,
          name: recipe.name,
          totalBatches: 0,
          executionCount: 0,
        });
      }
      const rSum = recipesSummary.get(recipe.id)!;
      rSum.totalBatches = parseFloat((rSum.totalBatches + batchCount).toFixed(3));
      rSum.executionCount += 1;

      if (recipe.recipe_product) {
        for (const rp of recipe.recipe_product) {
          const rawMat = rp.raw_material;
          if (!rawMat) continue;

          const converted = convertToBase(rp);
          const totalVolume = converted.volume * batchCount;
          const uom = converted.uom;

          if (!rawMaterialsSummary.has(rawMat.id)) {
            rawMaterialsSummary.set(rawMat.id, {
              id: rawMat.id,
              name: rawMat.name,
              volume: 0,
              uom: uom,
            });
          }
          const mSum = rawMaterialsSummary.get(rawMat.id)!;
          mSum.volume = parseFloat((mSum.volume + totalVolume).toFixed(3));
        }
      }
    }

    return {
      tag: {
        id: tag.id,
        name: tag.name,
        description: tag.description,
        startDate: tag.startDate,
        endDate: tag.endDate,
        isHidden: tag.isHidden,
      },
      totalExecutionsCount: executions.length,
      recipes: Array.from(recipesSummary.values()),
      rawMaterials: Array.from(rawMaterialsSummary.values()),
    };
  }
}
