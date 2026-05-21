import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AddonsService } from './services/addons.service';
import { CreateAddonDto } from './dto/create-addon.dto';
import { UpdateAddonDto } from './dto/update-addon.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('menu-addons')
export class AddonsController {
  constructor(private readonly addonsService: AddonsService) {}

  @Post()
  create(@Body() dto: CreateAddonDto) {
    return this.addonsService.create(dto);
  }

  @Get()
  findAll(@Query('moduleId') moduleId?: string, @Query('lang') lang?: string) {
    return this.addonsService.findAll(
      moduleId ? Number(moduleId) : undefined,
      lang,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Query('lang') lang?: string) {
    return this.addonsService.findOne(id, lang);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAddonDto) {
    return this.addonsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.addonsService.remove(id);
  }
}