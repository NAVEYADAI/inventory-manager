import { MeasurementType } from '../../enums';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class RawMaterialItemDto {
	@IsString()
	@IsNotEmpty()
	name: string;

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

export class CreateRawMaterialDto {
	@IsNumber()
	subscriptionId: number;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => RawMaterialItemDto)
	items: RawMaterialItemDto[];
}
