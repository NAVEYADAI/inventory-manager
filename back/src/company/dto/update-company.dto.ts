import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto';

export class UpdateCompanyDto {
	name?: string;
	identifier?: string;
	address?: string;
	phone?: string;
}
