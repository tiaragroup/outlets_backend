import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ModuleStorySection } from './entities/module-story-section.entity';
import { ModuleStoryStat } from './entities/module-story-stat.entity';
import { OutletModule } from '../menu/entities/module.entity';
import {
  CreateStorySectionDto,
  StoryStatDto,
} from './dto/create-story-section.dto';
import { UpdateStorySectionDto } from './dto/update-story-section.dto';
import { TranslationsService } from '../menu/services/translations.service';
import { TranslationModelType } from '../menu/entities/translation.entity';

@Injectable()
export class StorySectionsService {
  constructor(
    @InjectRepository(ModuleStorySection)
    private readonly storySectionRepository: Repository<ModuleStorySection>,

    @InjectRepository(ModuleStoryStat)
    private readonly storyStatRepository: Repository<ModuleStoryStat>,

    @InjectRepository(OutletModule)
    private readonly moduleRepository: Repository<OutletModule>,

    private readonly translationsService: TranslationsService,
  ) {}

  async create(dto: CreateStorySectionDto) {
    const moduleId = await this.resolveModuleId(dto.moduleId, dto.moduleSlug);

    const storySection = this.storySectionRepository.create({
      moduleId,
      slug: dto.slug,
      image: dto.image ?? null,
      mobileImage: dto.mobileImage ?? null,
      priority: dto.priority ?? 0,
      isActive: dto.isActive ?? true,
    });

    const saved = await this.storySectionRepository.save(storySection);

    await this.translationsService.upsertTranslations(
      TranslationModelType.MODULE_STORY_SECTION,
      saved.id,
      dto.translations || {},
    );

    await this.replaceStats(saved.id, dto.stats);

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

    const storySections = await this.storySectionRepository.find({
      where,
      relations: {
        module: true,
        stats: true,
      },
      order: {
        priority: 'ASC',
        id: 'ASC',
      },
    });

    return this.formatMany(storySections, lang);
  }

  async findOne(id: number, lang?: string) {
    const storySection = await this.storySectionRepository.findOne({
      where: { id },
      relations: {
        module: true,
        stats: true,
      },
    });

    if (!storySection) {
      throw new NotFoundException('Story section not found');
    }

    const [formatted] = await this.formatMany([storySection], lang);

    return formatted;
  }

  async findByModuleSlug(moduleSlug: string, lang?: string) {
    return this.findAll(lang, moduleSlug);
  }

  async update(id: number, dto: UpdateStorySectionDto) {
    const storySection = await this.storySectionRepository.findOne({
      where: { id },
    });

    if (!storySection) {
      throw new NotFoundException('Story section not found');
    }

    const moduleId =
      dto.moduleId || dto.moduleSlug
        ? await this.resolveModuleId(dto.moduleId, dto.moduleSlug)
        : storySection.moduleId;

    const hasImageField = Object.prototype.hasOwnProperty.call(dto, 'image');

    const hasMobileImageField = Object.prototype.hasOwnProperty.call(
      dto,
      'mobileImage',
    );

    await this.storySectionRepository.update(id, {
      moduleId,
      slug: dto.slug ?? storySection.slug,

      image: hasImageField ? dto.image ?? null : storySection.image,

      mobileImage: hasMobileImageField
        ? dto.mobileImage ?? null
        : storySection.mobileImage,

      priority: dto.priority ?? storySection.priority,
      isActive: dto.isActive ?? storySection.isActive,
    });

    await this.translationsService.upsertTranslations(
      TranslationModelType.MODULE_STORY_SECTION,
      id,
      dto.translations || {},
    );

    if (Object.prototype.hasOwnProperty.call(dto, 'stats')) {
      await this.replaceStats(id, dto.stats);
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    const storySection = await this.storySectionRepository.findOne({
      where: { id },
      relations: {
        stats: true,
      },
    });

    if (!storySection) {
      throw new NotFoundException('Story section not found');
    }

    await this.deleteStats(storySection.stats || []);

    await this.storySectionRepository.delete(id);

    await this.translationsService.deleteByModel(
      TranslationModelType.MODULE_STORY_SECTION,
      id,
    );

    return {
      success: true,
      message: 'Story section deleted successfully',
    };
  }

  /**
   * Replaces the whole stats list of a story section.
   * Passing undefined keeps the existing stats.
   */
  private async replaceStats(storySectionId: number, stats?: StoryStatDto[]) {
    if (!stats) {
      return;
    }

    const existingStats = await this.storyStatRepository.find({
      where: { storySectionId },
    });

    await this.deleteStats(existingStats);

    for (const [index, stat] of stats.entries()) {
      const saved = await this.storyStatRepository.save(
        this.storyStatRepository.create({
          storySectionId,
          slug: stat.slug,
          icon: stat.icon ?? null,
          priority: stat.priority ?? index + 1,
          isActive: stat.isActive ?? true,
        }),
      );

      await this.translationsService.upsertTranslations(
        TranslationModelType.MODULE_STORY_STAT,
        saved.id,
        stat.translations || {},
      );
    }
  }

  private async deleteStats(stats: ModuleStoryStat[]) {
    if (!stats.length) {
      return;
    }

    const statIds = stats.map((stat) => stat.id);

    await this.storyStatRepository.delete({ id: In(statIds) });

    await this.translationsService.deleteByModelIds(
      TranslationModelType.MODULE_STORY_STAT,
      statIds,
    );
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

  private async formatMany(
    storySections: ModuleStorySection[],
    lang?: string,
  ) {
    const sectionIds = storySections.map((item) => item.id);

    const statIds = storySections.flatMap((item) =>
      (item.stats || []).map((stat) => stat.id),
    );

    const sectionTranslations = lang
      ? await this.translationsService.getTranslationByLang(
          TranslationModelType.MODULE_STORY_SECTION,
          sectionIds,
          lang,
        )
      : await this.translationsService.getTranslations(
          TranslationModelType.MODULE_STORY_SECTION,
          sectionIds,
        );

    const statTranslations = lang
      ? await this.translationsService.getTranslationByLang(
          TranslationModelType.MODULE_STORY_STAT,
          statIds,
          lang,
        )
      : await this.translationsService.getTranslations(
          TranslationModelType.MODULE_STORY_STAT,
          statIds,
        );

    return storySections.map((item) =>
      this.formatStorySectionResponse(
        item,
        sectionTranslations,
        statTranslations,
        lang,
      ),
    );
  }

  private formatStorySectionResponse(
    storySection: ModuleStorySection,
    sectionTranslations: any,
    statTranslations: any,
    lang?: string,
  ) {
    const translations = sectionTranslations[storySection.id] || {};

    const stats = (storySection.stats || [])
      .sort((a, b) => a.priority - b.priority || Number(a.id) - Number(b.id))
      .map((stat) => {
        const currentStatTranslations = statTranslations[stat.id] || {};

        return {
          ...stat,
          translations: lang ? undefined : currentStatTranslations,
          ...(lang
            ? {
                value: currentStatTranslations.value || '',
                label: currentStatTranslations.label || '',
              }
            : {}),
        };
      });

    return {
      ...storySection,
      module: storySection.module
        ? {
            id: storySection.module.id,
            slug: storySection.module.slug,
          }
        : null,
      stats,
      translations: lang ? undefined : translations,
      ...(lang
        ? {
            eyebrow: translations.eyebrow || '',
            title: translations.title || '',
            description: translations.description || '',
            secondaryDescription: translations.secondary_description || '',
            imageAlt: translations.image_alt || '',
            imageCredit: translations.image_credit || '',
          }
        : {}),
    };
  }
}
