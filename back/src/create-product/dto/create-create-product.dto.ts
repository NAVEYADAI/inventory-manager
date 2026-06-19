import { IsNumber, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateCreateProductDto {
  @IsNotEmpty()
  @IsNumber()
  recipeId: number;

  @IsNotEmpty()
  @IsNumber()
  batche_count: number;

  @IsNotEmpty()
  @IsDateString()
  created_time: string;
}
