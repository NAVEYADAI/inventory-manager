import { Injectable } from '@nestjs/common';
import { CreateCreateProductDto } from './dto/create-create-product.dto';
import { UpdateCreateProductDto } from './dto/update-create-product.dto';

@Injectable()
export class CreateProductService {
  create(createCreateProductDto: CreateCreateProductDto) {
    return 'This action adds a new createProduct';
  }

  findAll() {
    return `This action returns all createProduct`;
  }

  findOne(id: number) {
    return `This action returns a #${id} createProduct`;
  }

  update(id: number, updateCreateProductDto: UpdateCreateProductDto) {
    return `This action updates a #${id} createProduct`;
  }

  remove(id: number) {
    return `This action removes a #${id} createProduct`;
  }
}
