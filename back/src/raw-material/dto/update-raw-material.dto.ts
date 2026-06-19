import { MeasurementType } from '../../enums';
import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateRawMaterialDto } from './create-raw-material.dto';

export class UpdateRawMaterialDto {
	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsBoolean()
	byWeight?: boolean;

	@IsOptional()
	@IsEnum(MeasurementType)
	measurementType?: MeasurementType;

	@IsOptional()
	@IsString()
	uom?: string;

	@IsOptional()
	@IsString()
	category?: string;
}

export class UpdateRawMaterialBulkDto extends PartialType(CreateRawMaterialDto) {}
