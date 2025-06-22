import { Module } from '@nestjs/common';
import { CreateProductService } from './create-product.service';
import { CreateProductController } from './create-product.controller';

@Module({
  controllers: [CreateProductController],
  providers: [CreateProductService],
})
export class CreateProductModule {}
