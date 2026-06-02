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
import { LegalContentsService } from './legal-contents.service';
import { CreateLegalContentDto } from './dto/create-legal-content.dto';
import { UpdateLegalContentDto } from './dto/update-legal-content.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LegalContentType } from './entities/module-legal-content.entity';

@Controller('legal-contents')
export class LegalContentsController {
  constructor(private readonly legalContentsService: LegalContentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateLegalContentDto) {
    return this.legalContentsService.create(dto);
  }

  @Get()
  findAll(
    @Query('lang') lang?: string,
    @Query('moduleSlug') moduleSlug?: string,
    @Query('contentType') contentType?: LegalContentType,
  ) {
    return this.legalContentsService.findAll(lang, moduleSlug, contentType);
  }

  @Get('by-module/:moduleSlug/:contentType')
  findByModuleAndType(
    @Param('moduleSlug') moduleSlug: string,
    @Param('contentType') contentType: LegalContentType,
    @Query('lang') lang?: string,
  ) {
    return this.legalContentsService.findByModuleAndType(
      moduleSlug,
      contentType,
      lang,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Query('lang') lang?: string) {
    return this.legalContentsService.findOne(id, lang);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLegalContentDto,
  ) {
    return this.legalContentsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.legalContentsService.remove(id);
  }
}