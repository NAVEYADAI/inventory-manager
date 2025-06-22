import { PartialType } from '@nestjs/mapped-types';
import { CreatePlatoonDto } from './create-platoon.dto';

export class UpdatePlatoonDto extends PartialType(CreatePlatoonDto) {}
