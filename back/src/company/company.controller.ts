import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, ForbiddenException } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(+id, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }

  @Get(':companyId/employees')
  async getEmployees(
    @Param('companyId') companyId: string,
    @Headers('authorization') authHeader: string,
  ) {
    // Validate request caller is logged in
    await this.authService.validateToken(authHeader);
    return this.companyService.findCompanyEmployees(+companyId);
  }

  @Post(':companyId/employees')
  async registerEmployee(
    @Param('companyId') companyId: string,
    @Headers('authorization') authHeader: string,
    @Body() body: any,
  ) {
    // Validate caller and check for ADMIN role
    const caller = await this.authService.validateToken(authHeader);
    const employees = await this.companyService.findCompanyEmployees(+companyId);
    const callerPermission = employees.find(e => e.user.id === caller.id);

    if (!callerPermission || callerPermission.role !== 'admin') {
      throw new ForbiddenException('Only managers can add employees to the company');
    }

    return this.companyService.registerEmployee(+companyId, body);
  }
}
