import { Injectable, NotFoundException } from '@nestjs/common';
import { MeasurementType } from '@inventory-manager/shared';
import { CreateRawMaterialDto, RawMaterialItemDto } from './dto/create-raw-material.dto';
import { UpdateRawMaterialDto } from './dto/update-raw-material.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RawMaterial } from './raw-material.entity';
import { Subscription } from '../subscription/subscription.entity';

@Injectable()
export class RawMaterialService {
  private defaultUomByMeasurementType: Record<MeasurementType, string> = {
    [MeasurementType.WEIGHT]: 'gram',
    [MeasurementType.VOLUME]: 'milliliter',
    [MeasurementType.COUNT]: 'piece',
  };

  private resolveMeasurementType(item: RawMaterialItemDto): MeasurementType {
    if (item.measurementType) return item.measurementType;
    if (item.byWeight === true) return MeasurementType.WEIGHT;
    return MeasurementType.COUNT;
  }

  constructor(
    @InjectRepository(RawMaterial)
    private readonly rawMaterialRepo: Repository<RawMaterial>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
  ) {}

  async createBulk(createRawMaterialDto: CreateRawMaterialDto) {
    const { subscriptionId, items } = createRawMaterialDto;
    const subscription = await this.subscriptionRepo.findOne({ where: { id: subscriptionId } });
    if (!subscription) throw new NotFoundException('Subscription not found');

    const toSave: RawMaterial[] = items.map((it: RawMaterialItemDto) =>
      {
        const measurementType = this.resolveMeasurementType(it);
        return this.rawMaterialRepo.create({
          name: it.name,
          measurementType,
          uom: it.uom ?? this.defaultUomByMeasurementType[measurementType],
          category: it.category?.trim() || null,
          priceIsOnUnit: false,
          subscription,
        });
      },
    );

    return await this.rawMaterialRepo.save(toSave);
  }

  async findAllForSubscription(subscriptionId: number) {
    return this.rawMaterialRepo.find({ where: { subscription: { id: subscriptionId } } });
  }

  async findOne(id: number) {
    return this.rawMaterialRepo.findOne({ where: { id } });
  }

  async update(id: number, updateRawMaterialDto: UpdateRawMaterialDto) {
    const raw = await this.rawMaterialRepo.findOne({ where: { id } });
    if (!raw) throw new NotFoundException('Raw material not found');
    if (!updateRawMaterialDto.measurementType && updateRawMaterialDto.byWeight !== undefined) {
      updateRawMaterialDto.measurementType = updateRawMaterialDto.byWeight
        ? MeasurementType.WEIGHT
        : MeasurementType.COUNT;
    }
    Object.assign(raw, updateRawMaterialDto);
    return this.rawMaterialRepo.save(raw);
  }

  async remove(id: number) {
    const raw = await this.rawMaterialRepo.findOne({ where: { id } });
    if (!raw) throw new NotFoundException('Raw material not found');
    await this.rawMaterialRepo.remove(raw);
    return { success: true };
  }
}
