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
import { MenuItemsService } from './services/menu-items.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Post()
  create(@Body() dto: CreateMenuItemDto) {
    return this.menuItemsService.create(dto);
  }

  @Get()
  findAll(
    @Query('categoryId') categoryId?: string,
    @Query('moduleId') moduleId?: string,
    @Query('lang') lang?: string,
  ) {
    return this.menuItemsService.findAll(
      categoryId ? Number(categoryId) : undefined,
      moduleId ? Number(moduleId) : undefined,
      lang,
    );
  }

  /**
   * Example:
   * GET /api/menu-items/by-category/cakes?moduleSlug=bakers-bakery&lang=en
   */
  @Get('by-category/:categorySlug')
  findByCategorySlug(
    @Param('categorySlug') categorySlug: string,
    @Query('moduleSlug') moduleSlug: string,
    @Query('lang') lang = 'en',
  ) {
    return this.menuItemsService.findByCategorySlug(
      categorySlug,
      moduleSlug,
      lang,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Query('lang') lang?: string) {
    return this.menuItemsService.findOne(id, lang);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMenuItemDto) {
    return this.menuItemsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuItemsService.remove(id);
  }
}