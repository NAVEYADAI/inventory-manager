import { IsNotEmpty, IsString, IsOptional, IsDateString, IsNumber, IsBoolean } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @IsNotEmpty()
  @IsNumber()
  subscriptionId: number;

  @IsOptional()
  @IsBoolean()
  isHidden?: boolean;
}
