import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-auth.dto';
import { LoginDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Post('register')
	async register(@Body() body: RegisterDto) {
		return this.authService.register(body);
	}

	@HttpCode(HttpStatus.OK)
	@Post('login')
	async login(@Body() body: LoginDto) {
		return this.authService.login(body);
	}

	@Get('me')
	async me(@Headers('authorization') authHeader: string) {
		const user = await this.authService.validateToken(authHeader);
		return { user };
	}

	@HttpCode(HttpStatus.OK)
	@Post('select-company')
	async selectCompany(
		@Headers('authorization') authHeader: string,
		@Body() body: { subscriptionId: number }
	) {
		const user = await this.authService.validateToken(authHeader);
		const result = await this.authService.selectCompany((user as any).id, body.subscriptionId);
		return result;
	}
}
