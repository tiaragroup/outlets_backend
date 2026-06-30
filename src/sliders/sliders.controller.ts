import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SlidersService } from './sliders.service';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('sliders')
export class SlidersController {
  constructor(private readonly slidersService: SlidersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateSliderDto) {
    return this.slidersService.create(dto);
  }

  @Get()
  findAll(
    @Query('lang') lang?: string,
    @Query('moduleSlug') moduleSlug?: string,
    @Query('moduleId') moduleId?: string,
  ) {
    return this.slidersService.findAll(
      lang,
      moduleSlug,
      moduleId ? Number(moduleId) : undefined,
    );
  }

  @Get('by-module/:moduleSlug')
  findByModuleSlug(
    @Param('moduleSlug') moduleSlug: string,
    @Query('lang') lang?: string,
  ) {
    return this.slidersService.findByModuleSlug(moduleSlug, lang);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Query('lang') lang?: string) {
    return this.slidersService.findOne(id, lang);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSliderDto) {
    return this.slidersService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.slidersService.remove(id);
  }
}