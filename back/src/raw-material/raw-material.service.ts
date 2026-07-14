import { Injectable, NotFoundException } from '@nestjs/common';
import { MeasurementType } from '../enums';
import { CreateRawMaterialDto, RawMaterialItemDto } from './dto/create-raw-material.dto';
import { UpdateRawMaterialDto } from './dto/update-raw-material.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RawMaterial } from './raw-material.entity';
import { Subscription } from '../subscription/subscription.entity';
import { RawMaterialConversion } from './raw-material-conversion.entity';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { ActivityCategory, ActivityAction } from '../activity-log/activity-log.entity';

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
    @InjectRepository(RawMaterialConversion)
    private readonly conversionRepo: Repository<RawMaterialConversion>,
    private readonly activityLogService: ActivityLogService,
  ) {}


  async createBulk(createRawMaterialDto: CreateRawMaterialDto, userId?: number) {
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

    const saved = await this.rawMaterialRepo.save(toSave);

    try {
      const names = saved.map(r => r.name);
      await this.activityLogService.log(
        subscriptionId,
        userId,
        ActivityAction.CREATE_RAW_MATERIAL_BULK,
        ActivityCategory.WORK_MANAGEMENT,
        `נוספו חומרי גלם חדשים: ${names.join(', ')}`,
      );
    } catch (e) {
      // ignore
    }

    return saved;
  }

  async findAllForSubscription(subscriptionId: number) {
    return this.rawMaterialRepo.find({
      where: { subscription: { id: subscriptionId } },
      relations: ['conversions'],
    });
  }

  async findOne(id: number) {
    return this.rawMaterialRepo.findOne({
      where: { id },
      relations: ['conversions'],
    });
  }

  async update(id: number, updateRawMaterialDto: UpdateRawMaterialDto, userId?: number) {
    const raw = await this.rawMaterialRepo.findOne({ where: { id }, relations: ['conversions', 'subscription'] });
    if (!raw) throw new NotFoundException('Raw material not found');
    if (!updateRawMaterialDto.measurementType && updateRawMaterialDto.byWeight !== undefined) {
      updateRawMaterialDto.measurementType = updateRawMaterialDto.byWeight
        ? MeasurementType.WEIGHT
        : MeasurementType.COUNT;
    }
    Object.assign(raw, updateRawMaterialDto);
    const saved = await this.rawMaterialRepo.save(raw);

    try {
      if (saved.subscription) {
        await this.activityLogService.log(
          saved.subscription.id,
          userId,
          ActivityAction.UPDATE_RAW_MATERIAL,
          ActivityCategory.WORK_MANAGEMENT,
          `עודכן חומר גלם: ${saved.name}`,
        );
      }
    } catch (e) {
      // ignore
    }

    return saved;
  }

  async remove(id: number, userId?: number) {
    const raw = await this.rawMaterialRepo.findOne({ where: { id }, relations: ['subscription'] });
    if (!raw) throw new NotFoundException('Raw material not found');
    const savedRaw = await this.rawMaterialRepo.remove(raw);

    try {
      if (raw.subscription) {
        await this.activityLogService.log(
          raw.subscription.id,
          userId,
          ActivityAction.DELETE_RAW_MATERIAL,
          ActivityCategory.WORK_MANAGEMENT,
          `נמחק חומר גלם: ${raw.name}`,
        );
      }
    } catch (e) {
      // ignore
    }

    return { success: true };
  }

  async addConversion(rawMaterialId: number, uomName: string, conversionFactor: number, baseUom: string, id?: number, userId?: number) {
    const raw = await this.rawMaterialRepo.findOne({ where: { id: rawMaterialId }, relations: ['conversions', 'subscription'] });
    if (!raw) throw new NotFoundException('Raw material not found');

    let conv = id ? raw.conversions?.find((c) => c.id === id) : raw.conversions?.find((c) => c.uomName === uomName);
    if (conv) {
      conv.uomName = uomName;
      conv.conversionFactor = conversionFactor;
      conv.baseUom = baseUom;
    } else {
      conv = this.conversionRepo.create({
        uomName,
        conversionFactor,
        baseUom,
        rawMaterial: raw,
      });
      if (!raw.conversions) {
        raw.conversions = [];
      }
      raw.conversions.push(conv);
    }
    await this.rawMaterialRepo.save(raw);

    try {
      if (raw.subscription) {
        await this.activityLogService.log(
          raw.subscription.id,
          userId,
          ActivityAction.ADD_RAW_MATERIAL_CONVERSION,
          ActivityCategory.WORK_MANAGEMENT,
          `נוספה המרת יחידות לחומר גלם ${raw.name}: ${uomName} לפי יחס ${conversionFactor}`,
        );
      }
    } catch (e) {
      // ignore
    }

    return conv;
  }
}
