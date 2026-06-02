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
import { GlobalLocationsService } from './services/global-locations.service';
import { CreateGlobalLocationDto } from './dto/create-global-location.dto';
import { UpdateGlobalLocationDto } from './dto/update-global-location.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('global-locations')
export class GlobalLocationsController {
  constructor(private readonly globalLocationsService: GlobalLocationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateGlobalLocationDto) {
    return this.globalLocationsService.create(dto);
  }

  @Get()
  findAll(@Query('lang') lang?: string) {
    return this.globalLocationsService.findAll(lang);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Query('lang') lang?: string) {
    return this.globalLocationsService.findOne(id, lang);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGlobalLocationDto,
  ) {
    return this.globalLocationsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.globalLocationsService.remove(id);
  }
}