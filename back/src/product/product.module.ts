import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Platoon } from 'src/platoon/platoon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Platoon])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
