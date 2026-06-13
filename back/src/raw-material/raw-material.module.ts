import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RawMaterialService } from './raw-material.service';
import { RawMaterialController } from './raw-material.controller';
import { RawMaterial } from './raw-material.entity';
import { Subscription } from '../subscription/subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RawMaterial, Subscription])],
  controllers: [RawMaterialController],
  providers: [RawMaterialService],
})
export class RawMaterialModule {}
