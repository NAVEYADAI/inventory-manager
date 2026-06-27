import { IsNotEmpty, IsString, IsNumber, IsArray, ValidateNested, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { UOM } from '../../enums';

export class RecipeIngredientDto {
  @IsNumber()
  rawMaterialId: number;

  @IsNumber()
  volume: number;

  @IsEnum(UOM)
  uom: UOM;

  @IsOptional()
  @IsString()
  customUom?: string;
}

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  subscriptionId: number;

  @IsOptional()
  @IsString()
  yieldType?: 'UNITS' | 'WEIGHT';

  @IsOptional()
  @IsBoolean()
  isIntermediate?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeIngredientDto)
  ingredients: RecipeIngredientDto[];
}
