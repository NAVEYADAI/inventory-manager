import { PartialType } from '@nestjs/mapped-types';
import { CreateInvetoryDto } from './create-invetory.dto';

export class UpdateInvetoryDto extends PartialType(CreateInvetoryDto) {}
