import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { OutletModule } from '../entities/module.entity';
import { MenuItem } from '../entities/menu-item.entity';
import { MenuCategory } from '../entities/menu-category.entity';
import { MenuItemVariant } from '../entities/menu-item-variant.entity';
import { MenuItemAddon } from '../entities/menu-item-addon.entity';
import { CreateMenuItemDto } from '../dto/create-menu-item.dto';
import { UpdateMenuItemDto } from '../dto/update-menu-item.dto';
import { TranslationsService } from './translations.service';
import {
  Translation,
  TranslationModelType,
} from '../entities/translation.entity';

@Injectable()
export class MenuItemsService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,

    @InjectRepository(MenuCategory)
    private readonly categoryRepository: Repository<MenuCategory>,

    @InjectRepository(OutletModule)
    private readonly moduleRepository: Repository<OutletModule>,

    private readonly translationsService: TranslationsService,
  ) {}

  async create(dto: CreateMenuItemDto) {
    const id = await this.dataSource.transaction(async (manager) => {
      const category = await manager.getRepository(MenuCategory).findOne({
        where: { id: dto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      const item = manager.getRepository(MenuItem).create({
        moduleId: dto.moduleId ?? category.moduleId,
        categoryId: dto.categoryId,
        slug: dto.slug,
        image: dto.image ?? null,
        priority: dto.priority ?? 0,
        sellerPriority: dto.sellerPriority ?? 0,
        isActive: dto.isActive ?? true,
      });

      const saved = await manager.getRepository(MenuItem).save(item);

      await this.translationsService.upsertTranslationsWithManager(
        manager,
        TranslationModelType.MENU_ITEM,
        saved.id,
        dto.translations,
      );

      await this.replaceVariants(manager, saved.id, dto.variants || []);
      await this.replaceAddons(manager, saved.id, dto.addonIds || []);

      return saved.id;
    });

    return this.findOne(id);
  }

  async findAll(
    categoryId?: number,
    moduleId?: number,
    moduleSlug?: string,
    lang?: string,
  ) {
    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (moduleSlug) {
      const module = await this.moduleRepository.findOne({
        where: { slug: moduleSlug },
      });

      if (!module) {
        throw new NotFoundException('Module not found');
      }

      where.moduleId = module.id;
    } else if (moduleId) {
      where.moduleId = moduleId;
    }

    const items = await this.menuItemRepository.find({
      where,
      relations: {
        category: true,
        variants: true,
        itemAddons: {
          addon: true,
        },
      },
      order: {
        priority: 'ASC',
        id: 'ASC',
        variants: {
          priority: 'ASC',
          id: 'ASC',
        },
      },
    });

    return this.attachTranslations(items, lang);
  }

  async findByCategorySlug(
    categorySlug: string,
    moduleSlug: string,
    lang = 'en',
  ) {
    if (!moduleSlug) {
      throw new BadRequestException('moduleSlug is required');
    }

    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .innerJoinAndSelect('category.module', 'module')
      .where('category.slug = :categorySlug', { categorySlug })
      .andWhere('module.slug = :moduleSlug', { moduleSlug })
      .getOne();

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const items = await this.menuItemRepository.find({
      where: {
        categoryId: category.id,
      },
      relations: {
        category: true,
        variants: true,
        itemAddons: {
          addon: true,
        },
      },
      order: {
        priority: 'ASC',
        id: 'ASC',
        variants: {
          priority: 'ASC',
          id: 'ASC',
        },
      },
    });

    const translatedItems = await this.attachTranslations(items, lang);

    const categoryTranslations =
      await this.translationsService.getTranslationByLang(
        TranslationModelType.MENU_CATEGORY,
        [category.id],
        lang,
      );

    return {
      category: {
        id: category.id,
        moduleId: category.moduleId,
        moduleSlug,
        slug: category.slug,
        image: category.image,
        priority: category.priority,
        isActive: category.isActive,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        name: categoryTranslations[category.id]?.name || '',
        description: categoryTranslations[category.id]?.description || '',
      },
      items: translatedItems,
    };
  }

  async findOne(id: number, lang?: string) {
    const item = await this.menuItemRepository.findOne({
      where: { id },
      relations: {
        category: true,
        variants: true,
        itemAddons: {
          addon: true,
        },
      },
      order: {
        variants: {
          priority: 'ASC',
          id: 'ASC',
        },
      },
    });

    if (!item) {
      throw new NotFoundException('Menu item not found');
    }

    const result = await this.attachTranslations([item], lang);

    return result[0];
  }

  async update(id: number, dto: UpdateMenuItemDto) {
    await this.dataSource.transaction(async (manager) => {
      const item = await manager.getRepository(MenuItem).findOne({
        where: { id },
      });

      if (!item) {
        throw new NotFoundException('Menu item not found');
      }

      let moduleId = dto.moduleId ?? item.moduleId;

      if (dto.categoryId) {
        const category = await manager.getRepository(MenuCategory).findOne({
          where: { id: dto.categoryId },
        });

        if (!category) {
          throw new NotFoundException('Category not found');
        }

        moduleId = dto.moduleId ?? category.moduleId;
      }

      /**
       * Important:
       * - image missing from body => keep old image
       * - image string => update image
       * - image null => remove image
       */
      const hasImageField = Object.prototype.hasOwnProperty.call(dto, 'image');

      await manager.getRepository(MenuItem).update(id, {
        moduleId,
        categoryId: dto.categoryId ?? item.categoryId,
        slug: dto.slug ?? item.slug,
        image: hasImageField ? dto.image ?? null : item.image,
        priority: dto.priority ?? item.priority,
        sellerPriority: dto.sellerPriority ?? item.sellerPriority,
        isActive: dto.isActive ?? item.isActive,
      });

      await this.translationsService.upsertTranslationsWithManager(
        manager,
        TranslationModelType.MENU_ITEM,
        id,
        dto.translations,
      );

      if (dto.variants) {
        await this.replaceVariants(manager, id, dto.variants);
      }

      if (dto.addonIds) {
        await this.replaceAddons(manager, id, dto.addonIds);
      }
    });

    return this.findOne(id);
  }

  async removeImage(id: number) {
    const item = await this.menuItemRepository.findOne({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Menu item not found');
    }

    await this.menuItemRepository.update(id, {
      image: null,
    });

    return {
      success: true,
      message: 'Menu item image removed successfully',
      id,
      image: null,
    };
  }

  async remove(id: number) {
    const item = await this.menuItemRepository.findOne({
      where: { id },
      relations: {
        variants: true,
      },
    });

    if (!item) {
      throw new NotFoundException('Menu item not found');
    }

    const variantIds = item.variants?.map((variant) => variant.id) || [];

    await this.translationsService.deleteByModelIds(
      TranslationModelType.MENU_ITEM_VARIANT,
      variantIds,
    );

    await this.translationsService.deleteByModel(
      TranslationModelType.MENU_ITEM,
      id,
    );

    await this.menuItemRepository.delete(id);

    return {
      success: true,
      message: 'Menu item deleted successfully',
    };
  }

  private async replaceVariants(
    manager: EntityManager,
    menuItemId: number,
    variants: any[],
  ) {
    const variantRepo = manager.getRepository(MenuItemVariant);
    const translationRepo = manager.getRepository(Translation);

    const existing = await variantRepo.find({
      where: { menuItemId },
    });

    const existingIds = existing.map((item) => item.id);

    if (existingIds.length) {
      await translationRepo.delete({
        modelType: TranslationModelType.MENU_ITEM_VARIANT,
        modelId: In(existingIds),
      });

      await variantRepo.delete({
        menuItemId,
      });
    }

    for (const variantDto of variants) {
      const variant = variantRepo.create({
        menuItemId,
        price: variantDto.price ?? 0,
        calories: variantDto.calories,
        priority: variantDto.priority ?? 0,
        isActive: variantDto.isActive ?? true,
      });

      const saved = await variantRepo.save(variant);

      await this.translationsService.upsertTranslationsWithManager(
        manager,
        TranslationModelType.MENU_ITEM_VARIANT,
        saved.id,
        variantDto.translations,
      );
    }
  }

  private async replaceAddons(
    manager: EntityManager,
    menuItemId: number,
    addonIds: number[],
  ) {
    const itemAddonRepo = manager.getRepository(MenuItemAddon);

    await itemAddonRepo.delete({
      menuItemId,
    });

    for (const addonId of addonIds) {
      await itemAddonRepo.save(
        itemAddonRepo.create({
          menuItemId,
          addonId,
        }),
      );
    }
  }

  private async attachTranslations(items: MenuItem[], lang?: string) {
    const itemIds = items.map((item) => item.id);

    const categoryIds = [
      ...new Set(items.map((item) => item.categoryId).filter(Boolean)),
    ];

    const variantIds = items.flatMap((item) =>
      item.variants ? item.variants.map((variant) => variant.id) : [],
    );

    const addonIds = items.flatMap((item) =>
      item.itemAddons
        ? item.itemAddons.map((itemAddon) => itemAddon.addonId)
        : [],
    );

    const itemTranslations = lang
      ? await this.translationsService.getTranslationByLang(
          TranslationModelType.MENU_ITEM,
          itemIds,
          lang,
        )
      : await this.translationsService.getTranslations(
          TranslationModelType.MENU_ITEM,
          itemIds,
        );

    const categoryTranslations = lang
      ? await this.translationsService.getTranslationByLang(
          TranslationModelType.MENU_CATEGORY,
          categoryIds,
          lang,
        )
      : await this.translationsService.getTranslations(
          TranslationModelType.MENU_CATEGORY,
          categoryIds,
        );

    const variantTranslations = lang
      ? await this.translationsService.getTranslationByLang(
          TranslationModelType.MENU_ITEM_VARIANT,
          variantIds,
          lang,
        )
      : await this.translationsService.getTranslations(
          TranslationModelType.MENU_ITEM_VARIANT,
          variantIds,
        );

    const addonTranslations = lang
      ? await this.translationsService.getTranslationByLang(
          TranslationModelType.MENU_ADDON,
          addonIds,
          lang,
        )
      : await this.translationsService.getTranslations(
          TranslationModelType.MENU_ADDON,
          addonIds,
        );

    return items.map((item) => ({
      ...item,

      category: item.category
        ? {
            id: item.category.id,
            moduleId: item.category.moduleId,
            slug: item.category.slug,
            image: item.category.image,
            priority: item.category.priority,
            isActive: item.category.isActive,
            createdAt: item.category.createdAt,
            updatedAt: item.category.updatedAt,
            translations: lang
              ? undefined
              : categoryTranslations[item.category.id] || {},
            ...(lang ? categoryTranslations[item.category.id] || {} : {}),
          }
        : null,

      translations: lang ? undefined : itemTranslations[item.id] || {},
      ...(lang ? itemTranslations[item.id] || {} : {}),

      variants:
        item.variants?.map((variant) => ({
          ...variant,
          translations: lang ? undefined : variantTranslations[variant.id] || {},
          ...(lang ? variantTranslations[variant.id] || {} : {}),
        })) || [],

      addons:
        item.itemAddons?.map((itemAddon) => ({
          ...itemAddon.addon,
          translations: lang
            ? undefined
            : addonTranslations[itemAddon.addonId] || {},
          ...(lang ? addonTranslations[itemAddon.addonId] || {} : {}),
        })) || [],
    }));
  }
}