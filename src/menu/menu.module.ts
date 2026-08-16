import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutletModule } from './entities/module.entity';
import { MenuCategory } from './entities/menu-category.entity';
import { MenuItem } from './entities/menu-item.entity';
import { MenuItemVariant } from './entities/menu-item-variant.entity';
import { MenuAddon } from './entities/menu-addon.entity';
import { MenuItemAddon } from './entities/menu-item-addon.entity';
import { MenuItemImage } from './entities/menu-item-image.entity';
import { Translation } from './entities/translation.entity';
import { ModulesController } from './modules.controller';
import { CategoriesController } from './categories.controller';
import { MenuItemsController } from './menu-items.controller';
import { AddonsController } from './addons.controller';
import { PublicMenuController } from './public-menu.controller';
import { ModulesService } from './services/modules.service';
import { CategoriesService } from './services/categories.service';
import { MenuItemsService } from './services/menu-items.service';
import { AddonsService } from './services/addons.service';
import { TranslationsService } from './services/translations.service';
import { PublicMenuService } from './services/public-menu.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OutletModule,
      MenuCategory,
      MenuItem,
      MenuItemVariant,
      MenuAddon,
      MenuItemAddon,
      MenuItemImage,
      Translation,
    ]),
  ],
  controllers: [
    ModulesController,
    CategoriesController,
    MenuItemsController,
    AddonsController,
    PublicMenuController,
  ],
  providers: [
    ModulesService,
    CategoriesService,
    MenuItemsService,
    AddonsService,
    TranslationsService,
    PublicMenuService,
  ],
  exports: [
    ModulesService,
    CategoriesService,
    MenuItemsService,
    AddonsService,
    TranslationsService,
  ],
})
export class MenuModule {}