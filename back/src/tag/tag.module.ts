import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { Tag } from './tag.entity';
import { Subscription } from 'src/subscription/subscription.entity';
import { CreateProduct } from 'src/create-product/create-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, Subscription, CreateProduct])],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
