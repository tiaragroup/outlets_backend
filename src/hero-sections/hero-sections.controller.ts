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
import { HeroSectionsService } from './hero-sections.service';
import { CreateHeroSectionDto } from './dto/create-hero-section.dto';
import { UpdateHeroSectionDto } from './dto/update-hero-section.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('hero-sections')
export class HeroSectionsController {
  constructor(private readonly heroSectionsService: HeroSectionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateHeroSectionDto) {
    return this.heroSectionsService.create(dto);
  }

  @Get()
  findAll(
    @Query('lang') lang?: string,
    @Query('moduleSlug') moduleSlug?: string,
    @Query('moduleId') moduleId?: string,
  ) {
    return this.heroSectionsService.findAll(
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
    return this.heroSectionsService.findByModuleSlug(moduleSlug, lang);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Query('lang') lang?: string) {
    return this.heroSectionsService.findOne(id, lang);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHeroSectionDto,
  ) {
    return this.heroSectionsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.heroSectionsService.remove(id);
  }
}