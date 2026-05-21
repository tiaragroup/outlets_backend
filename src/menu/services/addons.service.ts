import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuAddon } from '../entities/menu-addon.entity';
import { CreateAddonDto } from '../dto/create-addon.dto';
import { UpdateAddonDto } from '../dto/update-addon.dto';
import { TranslationsService } from './translations.service';
import { TranslationModelType } from '../entities/translation.entity';

@Injectable()
export class AddonsService {
  constructor(
    @InjectRepository(MenuAddon)
    private readonly addonRepository: Repository<MenuAddon>,
    private readonly translationsService: TranslationsService,
  ) {}

  async create(dto: CreateAddonDto) {
    const addon = this.addonRepository.create({
      moduleId: dto.moduleId,
      slug: dto.slug,
      price: dto.price ?? 0,
      calories: dto.calories,
      image: dto.image,
      priority: dto.priority ?? 0,
      isActive: dto.isActive ?? true,
    });

    const saved = await this.addonRepository.save(addon);

    await this.translationsService.upsertTranslations(
      TranslationModelType.MENU_ADDON,
      saved.id,
      dto.translations,
    );

    return this.findOne(saved.id);
  }

  async findAll(moduleId?: number, lang?: string) {
    const addons = await this.addonRepository.find({
      where: moduleId ? { moduleId } : {},
      order: {
        priority: 'ASC',
        id: 'ASC',
      },
    });

    const ids = addons.map((item) => item.id);
    const translations = lang
      ? await this.translationsService.getTranslationByLang(
          TranslationModelType.MENU_ADDON,
          ids,
          lang,
        )
      : await this.translationsService.getTranslations(
          TranslationModelType.MENU_ADDON,
          ids,
        );

    return addons.map((item) => ({
      ...item,
      translations: lang ? undefined : translations[item.id] || {},
      ...(lang ? translations[item.id] || {} : {}),
    }));
  }

  async findOne(id: number, lang?: string) {
    const addon = await this.addonRepository.findOne({
      where: { id },
    });

    if (!addon) {
      throw new NotFoundException('Addon not found');
    }

    const translations = lang
      ? await this.translationsService.getTranslationByLang(
          TranslationModelType.MENU_ADDON,
          [id],
          lang,
        )
      : await this.translationsService.getTranslations(
          TranslationModelType.MENU_ADDON,
          [id],
        );

    return {
      ...addon,
      translations: lang ? undefined : translations[id] || {},
      ...(lang ? translations[id] || {} : {}),
    };
  }

  async update(id: number, dto: UpdateAddonDto) {
    const addon = await this.addonRepository.findOne({
      where: { id },
    });

    if (!addon) {
      throw new NotFoundException('Addon not found');
    }

    await this.addonRepository.update(id, {
      moduleId: dto.moduleId ?? addon.moduleId,
      slug: dto.slug ?? addon.slug,
      price: dto.price ?? addon.price,
      calories: dto.calories ?? addon.calories,
      image: dto.image ?? addon.image,
      priority: dto.priority ?? addon.priority,
      isActive: dto.isActive ?? addon.isActive,
    });

    await this.translationsService.upsertTranslations(
      TranslationModelType.MENU_ADDON,
      id,
      dto.translations,
    );

    return this.findOne(id);
  }

  async remove(id: number) {
    const addon = await this.addonRepository.findOne({
      where: { id },
    });

    if (!addon) {
      throw new NotFoundException('Addon not found');
    }

    await this.addonRepository.delete(id);
    await this.translationsService.deleteByModel(
      TranslationModelType.MENU_ADDON,
      id,
    );

    return {
      success: true,
      message: 'Addon deleted successfully',
    };
  }
}