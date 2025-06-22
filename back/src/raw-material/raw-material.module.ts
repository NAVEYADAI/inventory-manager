import { Module } from '@nestjs/common';
import { RawMaterialService } from './raw-material.service';
import { RawMaterialController } from './raw-material.controller';

@Module({
  controllers: [RawMaterialController],
  providers: [RawMaterialService],
})
export class RawMaterialModule {}
