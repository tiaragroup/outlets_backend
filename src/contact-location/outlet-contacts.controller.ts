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
import { OutletContactsService } from './services/outlet-contacts.service';
import { CreateOutletContactDto } from './dto/create-outlet-contact.dto';
import { UpdateOutletContactDto } from './dto/update-outlet-contact.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('outlet-contacts')
export class OutletContactsController {
  constructor(private readonly outletContactsService: OutletContactsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateOutletContactDto) {
    return this.outletContactsService.create(dto);
  }

  @Get()
  findAll(
    @Query('lang') lang?: string,
    @Query('moduleSlug') moduleSlug?: string,
  ) {
    return this.outletContactsService.findAll(lang, moduleSlug);
  }

  @Get('by-module/:moduleSlug')
  findByModuleSlug(
    @Param('moduleSlug') moduleSlug: string,
    @Query('lang') lang?: string,
  ) {
    return this.outletContactsService.findByModuleSlug(moduleSlug, lang);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Query('lang') lang?: string) {
    return this.outletContactsService.findOne(id, lang);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOutletContactDto,
  ) {
    return this.outletContactsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.outletContactsService.remove(id);
  }
}