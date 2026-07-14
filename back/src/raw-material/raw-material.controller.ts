import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Headers } from '@nestjs/common';
import { RawMaterialService } from './raw-material.service';
import { CreateRawMaterialDto } from './dto/create-raw-material.dto';
import { UpdateRawMaterialDto } from './dto/update-raw-material.dto';
import { AuthService } from '../auth/auth.service';

@Controller('raw-material')
export class RawMaterialController {
  constructor(
    private readonly rawMaterialService: RawMaterialService,
    private readonly authService: AuthService,
  ) {}

  @Post('bulk')
  async createBulk(
    @Headers('authorization') authHeader: string,
    @Body() createRawMaterialDto: CreateRawMaterialDto,
  ) {
    let userId: number | undefined;
    if (authHeader) {
      try {
        const user = await this.authService.validateToken(authHeader);
        userId = user.id;
      } catch (e) {
        // ignore
      }
    }
    return this.rawMaterialService.createBulk(createRawMaterialDto, userId);
  }

  @Get()
  findAll(@Query('subscriptionId') subscriptionId?: string) {
    if (subscriptionId) return this.rawMaterialService.findAllForSubscription(+subscriptionId);
    return this.rawMaterialService.findAllForSubscription(0 as any);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rawMaterialService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Headers('authorization') authHeader: string,
    @Param('id') id: string,
    @Body() updateRawMaterialDto: UpdateRawMaterialDto,
  ) {
    let userId: number | undefined;
    if (authHeader) {
      try {
        const user = await this.authService.validateToken(authHeader);
        userId = user.id;
      } catch (e) {
        // ignore
      }
    }
    return this.rawMaterialService.update(+id, updateRawMaterialDto, userId);
  }

  @Post(':id/conversion')
  async addConversion(
    @Headers('authorization') authHeader: string,
    @Param('id') id: string,
    @Body() body: { id?: number; uomName: string; conversionFactor: number; baseUom: string },
  ) {
    let userId: number | undefined;
    if (authHeader) {
      try {
        const user = await this.authService.validateToken(authHeader);
        userId = user.id;
      } catch (e) {
        // ignore
      }
    }
    return this.rawMaterialService.addConversion(+id, body.uomName, body.conversionFactor, body.baseUom, body.id, userId);
  }

  @Delete(':id')
  async remove(
    @Headers('authorization') authHeader: string,
    @Param('id') id: string,
  ) {
    let userId: number | undefined;
    if (authHeader) {
      try {
        const user = await this.authService.validateToken(authHeader);
        userId = user.id;
      } catch (e) {
        // ignore
      }
    }
    return this.rawMaterialService.remove(+id, userId);
  }
}

