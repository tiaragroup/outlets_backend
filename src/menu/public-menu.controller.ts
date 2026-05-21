import { Controller, Get, Param, Query } from '@nestjs/common';
import { PublicMenuService } from './services/public-menu.service';

@Controller('public/menu')
export class PublicMenuController {
  constructor(private readonly publicMenuService: PublicMenuService) {}

  @Get(':outletSlug')
  getOutletMenu(
    @Param('outletSlug') outletSlug: string,
    @Query('lang') lang = 'en',
  ) {
    return this.publicMenuService.getOutletMenu(outletSlug, lang);
  }
}