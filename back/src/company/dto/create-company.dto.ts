export class CreateCompanyDto {
	name: string;
	identifier?: string;
	address?: string;
	phone?: string;
	/** optionally associate the new company with an existing user */
	ownerId?: number;
}
