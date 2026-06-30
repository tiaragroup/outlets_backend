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
import { SocialLinksService } from './social-links.service';
import { CreateSocialLinkDto } from './dto/create-social-link.dto';
import { UpdateSocialLinkDto } from './dto/update-social-link.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('social-links')
export class SocialLinksController {
  constructor(private readonly socialLinksService: SocialLinksService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateSocialLinkDto) {
    return this.socialLinksService.create(dto);
  }

  @Get()
  findAll(
    @Query('lang') lang?: string,
    @Query('moduleSlug') moduleSlug?: string,
    @Query('moduleId') moduleId?: string,
  ) {
    return this.socialLinksService.findAll(
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
    return this.socialLinksService.findByModuleSlug(moduleSlug, lang);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Query('lang') lang?: string) {
    return this.socialLinksService.findOne(id, lang);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSocialLinkDto,
  ) {
    return this.socialLinksService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.socialLinksService.remove(id);
  }
}