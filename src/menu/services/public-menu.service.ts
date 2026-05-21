import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { OutletModule } from '../entities/module.entity';
import { MenuCategory } from '../entities/menu-category.entity';
import { MenuItem } from '../entities/menu-item.entity';
import { TranslationsService } from './translations.service';
import { TranslationModelType } from '../entities/translation.entity';

@Injectable()
export class PublicMenuService {
  constructor(
    @InjectRepository(OutletModule)
    private readonly moduleRepository: Repository<OutletModule>,
    @InjectRepository(MenuCategory)
    private readonly categoryRepository: Repository<MenuCategory>,
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    private readonly translationsService: TranslationsService,
  ) {}

  async getOutletMenu(outletSlug: string, lang = 'en') {
    const module = await this.moduleRepository.findOne({
      where: {
        slug: outletSlug,
        isActive: true,
      },
    });

    if (!module) {
      throw new NotFoundException('Outlet not found');
    }

    const categories = await this.categoryRepository.find({
      where: {
        moduleId: module.id,
        isActive: true,
      },
      order: {
        priority: 'ASC',
        id: 'ASC',
      },
    });

    const categoryIds = categories.map((category) => category.id);

    const items = categoryIds.length
      ? await this.menuItemRepository.find({
          where: {
            categoryId: In(categoryIds),
            isActive: true,
          },
          relations: {
            variants: true,
          },
          order: {
            priority: 'ASC',
            id: 'ASC',
            variants: {
              priority: 'ASC',
              id: 'ASC',
            },
          },
        })
      : [];

    const categoryTranslations =
      await this.translationsService.getTranslationByLang(
        TranslationModelType.MENU_CATEGORY,
        categoryIds,
        lang,
      );

    const itemIds = items.map((item) => item.id);
    const itemTranslations =
      await this.translationsService.getTranslationByLang(
        TranslationModelType.MENU_ITEM,
        itemIds,
        lang,
      );

    const variantIds = items.flatMap((item) =>
      item.variants ? item.variants.map((variant) => variant.id) : [],
    );

    const variantTranslations =
      await this.translationsService.getTranslationByLang(
        TranslationModelType.MENU_ITEM_VARIANT,
        variantIds,
        lang,
      );

    return {
      outletSlug: module.slug,
      categories: categories.map((category) => ({
        id: category.id,
        slug: category.slug,
        name: categoryTranslations[category.id]?.name || '',
        description: categoryTranslations[category.id]?.description,
        items: items
          .filter((item) => item.categoryId === category.id)
          .map((item) => ({
            id: item.id,
            slug: item.slug,
            name: itemTranslations[item.id]?.name || '',
            description: itemTranslations[item.id]?.description,
            image: item.image,
            isActive: item.isActive,
            variants:
              item.variants?.map((variant) => ({
                id: variant.id,
                label: variantTranslations[variant.id]?.label || '',
                price: variant.price,
                calories: variant.calories,
              })) || [],
          })),
      })),
    };
  }
}