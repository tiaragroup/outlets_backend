import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModuleHeroSection } from './entities/module-hero-section.entity';
import { OutletModule } from '../menu/entities/module.entity';
import { CreateHeroSectionDto } from './dto/create-hero-section.dto';
import { UpdateHeroSectionDto } from './dto/update-hero-section.dto';
import { TranslationsService } from '../menu/services/translations.service';
import { TranslationModelType } from '../menu/entities/translation.entity';

@Injectable()
export class HeroSectionsService {
  constructor(
    @InjectRepository(ModuleHeroSection)
    private readonly heroSectionRepository: Repository<ModuleHeroSection>,

    @InjectRepository(OutletModule)
    private readonly moduleRepository: Repository<OutletModule>,

    private readonly translationsService: TranslationsService,
  ) {}

  async create(dto: CreateHeroSectionDto) {
    const moduleId = await this.resolveModuleId(dto.moduleId, dto.moduleSlug);

    const heroSection = this.heroSectionRepository.create({
      moduleId,
      slug: dto.slug,
      backgroundImage: dto.backgroundImage ?? null,
      mobileBackgroundImage: dto.mobileBackgroundImage ?? null,
      primaryButtonUrl: dto.primaryButtonUrl ?? null,
      secondaryButtonUrl: dto.secondaryButtonUrl ?? null,
      priority: dto.priority ?? 0,
      isActive: dto.isActive ?? true,
    });

    const saved = await this.heroSectionRepository.save(heroSection);

    await this.translationsService.upsertTranslations(
      TranslationModelType.MODULE_HERO_SECTION,
      saved.id,
      dto.translations || {},
    );

    return this.findOne(saved.id);
  }

  async findAll(lang?: string, moduleSlug?: string, moduleId?: number) {
    const where: any = {};

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

    const heroSections = await this.heroSectionRepository.find({
      where,
      relations: {
        module: true,
      },
      order: {
        priority: 'ASC',
        id: 'ASC',
      },
    });

    const ids = heroSections.map((item) => item.id);

    const translations = lang
      ? await this.translationsService.getTranslationByLang(
          TranslationModelType.MODULE_HERO_SECTION,
          ids,
          lang,
        )
      : await this.translationsService.getTranslations(
          TranslationModelType.MODULE_HERO_SECTION,
          ids,
        );

    return heroSections.map((item) =>
      this.formatHeroSectionResponse(item, translations, lang),
    );
  }

  async findOne(id: number, lang?: string) {
    const heroSection = await this.heroSectionRepository.findOne({
      where: { id },
      relations: {
        module: true,
      },
    });

    if (!heroSection) {
      throw new NotFoundException('Hero section not found');
    }

    const translations = lang
      ? await this.translationsService.getTranslationByLang(
          TranslationModelType.MODULE_HERO_SECTION,
          [id],
          lang,
        )
      : await this.translationsService.getTranslations(
          TranslationModelType.MODULE_HERO_SECTION,
          [id],
        );

    return this.formatHeroSectionResponse(heroSection, translations, lang);
  }

  async findByModuleSlug(moduleSlug: string, lang?: string) {
    return this.findAll(lang, moduleSlug);
  }

  async update(id: number, dto: UpdateHeroSectionDto) {
    const heroSection = await this.heroSectionRepository.findOne({
      where: { id },
    });

    if (!heroSection) {
      throw new NotFoundException('Hero section not found');
    }

    const moduleId =
      dto.moduleId || dto.moduleSlug
        ? await this.resolveModuleId(dto.moduleId, dto.moduleSlug)
        : heroSection.moduleId;

    const hasBackgroundImageField = Object.prototype.hasOwnProperty.call(
      dto,
      'backgroundImage',
    );

    const hasMobileBackgroundImageField =
      Object.prototype.hasOwnProperty.call(dto, 'mobileBackgroundImage');

    const hasPrimaryButtonUrlField = Object.prototype.hasOwnProperty.call(
      dto,
      'primaryButtonUrl',
    );

    const hasSecondaryButtonUrlField = Object.prototype.hasOwnProperty.call(
      dto,
      'secondaryButtonUrl',
    );

    await this.heroSectionRepository.update(id, {
      moduleId,
      slug: dto.slug ?? heroSection.slug,

      backgroundImage: hasBackgroundImageField
        ? dto.backgroundImage ?? null
        : heroSection.backgroundImage,

      mobileBackgroundImage: hasMobileBackgroundImageField
        ? dto.mobileBackgroundImage ?? null
        : heroSection.mobileBackgroundImage,

      primaryButtonUrl: hasPrimaryButtonUrlField
        ? dto.primaryButtonUrl ?? null
        : heroSection.primaryButtonUrl,

      secondaryButtonUrl: hasSecondaryButtonUrlField
        ? dto.secondaryButtonUrl ?? null
        : heroSection.secondaryButtonUrl,

      priority: dto.priority ?? heroSection.priority,
      isActive: dto.isActive ?? heroSection.isActive,
    });

    await this.translationsService.upsertTranslations(
      TranslationModelType.MODULE_HERO_SECTION,
      id,
      dto.translations || {},
    );

    return this.findOne(id);
  }

  async remove(id: number) {
    const heroSection = await this.heroSectionRepository.findOne({
      where: { id },
    });

    if (!heroSection) {
      throw new NotFoundException('Hero section not found');
    }

    await this.heroSectionRepository.delete(id);

    await this.translationsService.deleteByModel(
      TranslationModelType.MODULE_HERO_SECTION,
      id,
    );

    return {
      success: true,
      message: 'Hero section deleted successfully',
    };
  }

  private async resolveModuleId(
    moduleId?: number,
    moduleSlug?: string,
  ): Promise<number> {
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

  private formatHeroSectionResponse(
    heroSection: ModuleHeroSection,
    translations: any,
    lang?: string,
  ) {
    const heroTranslations = translations[heroSection.id] || {};

    return {
      ...heroSection,
      module: heroSection.module
        ? {
            id: heroSection.module.id,
            slug: heroSection.module.slug,
          }
        : null,
      translations: lang ? undefined : heroTranslations,
      ...(lang
        ? {
            eyebrow: heroTranslations.eyebrow || '',
            title: heroTranslations.title || '',
            description: heroTranslations.description || '',
            primaryButtonText: heroTranslations.primary_button_text || '',
            secondaryButtonText: heroTranslations.secondary_button_text || '',
          }
        : {}),
    };
  }
}