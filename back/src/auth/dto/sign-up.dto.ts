import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty() @IsString()
  name: string;

  @IsNotEmpty() @IsString()
  firstName: string;

  @IsNotEmpty() @IsString()
  lastName: string;

  @IsNotEmpty() @IsString()
  address: string;

  @IsNotEmpty() @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsNotEmpty() @IsString()
  password: string;
}
