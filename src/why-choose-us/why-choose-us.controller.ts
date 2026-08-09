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
import { WhyChooseUsService } from './why-choose-us.service';
import { CreateWhyChooseUsSectionDto } from './dto/create-why-choose-us-section.dto';
import { UpdateWhyChooseUsSectionDto } from './dto/update-why-choose-us-section.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('why-choose-us')
export class WhyChooseUsController {
  constructor(private readonly whyChooseUsService: WhyChooseUsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateWhyChooseUsSectionDto) {
    return this.whyChooseUsService.create(dto);
  }

  @Get()
  findAll(
    @Query('lang') lang?: string,
    @Query('moduleSlug') moduleSlug?: string,
    @Query('moduleId') moduleId?: string,
  ) {
    return this.whyChooseUsService.findAll(
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
    return this.whyChooseUsService.findByModuleSlug(moduleSlug, lang);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Query('lang') lang?: string) {
    return this.whyChooseUsService.findOne(id, lang);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWhyChooseUsSectionDto,
  ) {
    return this.whyChooseUsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.whyChooseUsService.remove(id);
  }
}
