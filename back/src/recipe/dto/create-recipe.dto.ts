import { IsNotEmpty, IsString, IsNumber, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { UOM } from '../../enums';

export class RecipeIngredientDto {
  @IsNumber()
  rawMaterialId: number;

  @IsNumber()
  volume: number;

  @IsEnum(UOM)
  uom: UOM;
}

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  subscriptionId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeIngredientDto)
  ingredients: RecipeIngredientDto[];
}
