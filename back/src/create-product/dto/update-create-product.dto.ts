import { PartialType } from '@nestjs/mapped-types';
import { CreateCreateProductDto } from './create-create-product.dto';

export class UpdateCreateProductDto extends PartialType(CreateCreateProductDto) {}
