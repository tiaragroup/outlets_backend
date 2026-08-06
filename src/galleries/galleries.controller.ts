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
import { GalleriesService } from './galleries.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('galleries')
export class GalleriesController {
  constructor(private readonly galleriesService: GalleriesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateGalleryDto) {
    return this.galleriesService.create(dto);
  }

  @Get()
  findAll(
    @Query('moduleSlug') moduleSlug?: string,
    @Query('moduleId') moduleId?: string,
  ) {
    return this.galleriesService.findAll(
      moduleSlug,
      moduleId ? Number(moduleId) : undefined,
    );
  }

  @Get('by-module/:moduleSlug')
  findByModuleSlug(@Param('moduleSlug') moduleSlug: string) {
    return this.galleriesService.findByModuleSlug(moduleSlug);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.galleriesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGalleryDto) {
    return this.galleriesService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/image')
  removeImage(@Param('id', ParseIntPipe) id: number) {
    return this.galleriesService.removeImage(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.galleriesService.remove(id);
  }
}
