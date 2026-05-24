import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuCategory } from '../entities/menu-category.entity';
import { OutletModule } from '../entities/module.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { TranslationsService } from './translations.service';
import { TranslationModelType } from '../entities/translation.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(MenuCategory)
    private readonly categoryRepository: Repository<MenuCategory>,

    @InjectRepository(OutletModule)
    private readonly moduleRepository: Repository<OutletModule>,

    private readonly translationsService: TranslationsService,
  ) {}

  async create(dto: CreateCategoryDto) {
    const moduleId = await this.resolveModuleId(dto.moduleId, dto.moduleSlug);

    const category = this.categoryRepository.create({
      moduleId,
      slug: dto.slug,
      image: dto.image,
      priority: dto.priority ?? 0,
      isActive: dto.isActive ?? true,
    });

    const saved = await this.categoryRepository.save(category);

    await this.translationsService.upsertTranslations(
      TranslationModelType.MENU_CATEGORY,
      saved.id,
      dto.translations,
    );

    return this.findOne(saved.id);
  }

  async findAll(moduleId?: number, lang?: string) {
    const categories = await this.categoryRepository.find({
      where: moduleId ? { moduleId } : {},
      order: {
        priority: 'ASC',
        id: 'ASC',
      },
    });

    const ids = categories.map((item) => item.id);

    const translations = lang
      ? await this.translationsService.getTranslationByLang(
          TranslationModelType.MENU_CATEGORY,
          ids,
          lang,
        )
      : await this.translationsService.getTranslations(
          TranslationModelType.MENU_CATEGORY,
          ids,
        );

    return categories.map((item) => ({
      ...item,
      translations: lang ? undefined : translations[item.id] || {},
      ...(lang ? translations[item.id] || {} : {}),
    }));
  }

  async findOne(id: number, lang?: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const translations = lang
      ? await this.translationsService.getTranslationByLang(
          TranslationModelType.MENU_CATEGORY,
          [id],
          lang,
        )
      : await this.translationsService.getTranslations(
          TranslationModelType.MENU_CATEGORY,
          [id],
        );

    return {
      ...category,
      translations: lang ? undefined : translations[id] || {},
      ...(lang ? translations[id] || {} : {}),
    };
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    let moduleId = category.moduleId;

    if (dto.moduleId || dto.moduleSlug) {
      moduleId = await this.resolveModuleId(dto.moduleId, dto.moduleSlug);
    }

    await this.categoryRepository.update(id, {
      moduleId,
      slug: dto.slug ?? category.slug,
      image: dto.image ?? category.image,
      priority: dto.priority ?? category.priority,
      isActive: dto.isActive ?? category.isActive,
    });

    await this.translationsService.upsertTranslations(
      TranslationModelType.MENU_CATEGORY,
      id,
      dto.translations,
    );

    return this.findOne(id);
  }

  async remove(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.categoryRepository.delete(id);

    await this.translationsService.deleteByModel(
      TranslationModelType.MENU_CATEGORY,
      id,
    );

    return {
      success: true,
      message: 'Category deleted successfully',
    };
  }

  private async resolveModuleId(moduleId?: number, moduleSlug?: string) {
    if (moduleId) {
      const module = await this.moduleRepository.findOne({
        where: { id: moduleId },
      });

      if (!module) {
        throw new NotFoundException('Module not found');
      }

      return module.id;
    }

    if (moduleSlug) {
      const module = await this.moduleRepository.findOne({
        where: { slug: moduleSlug },
      });

      if (!module) {
        throw new NotFoundException('Module not found');
      }

      return module.id;
    }

    throw new BadRequestException('moduleId or moduleSlug is required');
  }
}