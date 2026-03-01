export class CreateUserDto {
	userName?: string;
	firstName?: string;
	lastName?: string;
	address?: string;
	phone?: string;
	email!: string;
	password!: string;
}
