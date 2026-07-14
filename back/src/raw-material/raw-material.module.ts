import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RawMaterialService } from './raw-material.service';
import { RawMaterialController } from './raw-material.controller';
import { RawMaterial } from './raw-material.entity';
import { Subscription } from '../subscription/subscription.entity';
import { RawMaterialConversion } from './raw-material-conversion.entity';
import { AuthModule } from '../auth/auth.module';
import { ActivityLogModule } from '../activity-log/activity-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RawMaterial, Subscription, RawMaterialConversion]),
    AuthModule,
    ActivityLogModule,
  ],
  controllers: [RawMaterialController],
  providers: [RawMaterialService],
  exports: [TypeOrmModule, RawMaterialService],
})
export class RawMaterialModule {}

