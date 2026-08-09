import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ModuleWhyChooseUsSection } from './entities/module-why-choose-us-section.entity';
import { ModuleWhyChooseUsFeature } from './entities/module-why-choose-us-feature.entity';
import { OutletModule } from '../menu/entities/module.entity';
import {
  CreateWhyChooseUsSectionDto,
  WhyChooseUsFeatureDto,
} from './dto/create-why-choose-us-section.dto';
import { UpdateWhyChooseUsSectionDto } from './dto/update-why-choose-us-section.dto';
import { TranslationsService } from '../menu/services/translations.service';
import { TranslationModelType } from '../menu/entities/translation.entity';

@Injectable()
export class WhyChooseUsService {
  constructor(
    @InjectRepository(ModuleWhyChooseUsSection)
    private readonly whyChooseUsSectionRepository: Repository<ModuleWhyChooseUsSection>,

    @InjectRepository(ModuleWhyChooseUsFeature)
    private readonly whyChooseUsFeatureRepository: Repository<ModuleWhyChooseUsFeature>,

    @InjectRepository(OutletModule)
    private readonly moduleRepository: Repository<OutletModule>,

    private readonly translationsService: TranslationsService,
  ) {}

  async create(dto: CreateWhyChooseUsSectionDto) {
    const moduleId = await this.resolveModuleId(dto.moduleId, dto.moduleSlug);

    const whyChooseUsSection = this.whyChooseUsSectionRepository.create({
      moduleId,
      slug: dto.slug,
      priority: dto.priority ?? 0,
      isActive: dto.isActive ?? true,
    });

    const saved =
      await this.whyChooseUsSectionRepository.save(whyChooseUsSection);

    await this.translationsService.upsertTranslations(
      TranslationModelType.MODULE_WHY_CHOOSE_US_SECTION,
      saved.id,
      dto.translations || {},
    );

    await this.replaceFeatures(saved.id, dto.features);

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

    const whyChooseUsSections = await this.whyChooseUsSectionRepository.find({
      where,
      relations: {
        module: true,
        features: true,
      },
      order: {
        priority: 'ASC',
        id: 'ASC',
      },
    });

    return this.formatMany(whyChooseUsSections, lang);
  }

  async findOne(id: number, lang?: string) {
    const whyChooseUsSection = await this.whyChooseUsSectionRepository.findOne({
      where: { id },
      relations: {
        module: true,
        features: true,
      },
    });

    if (!whyChooseUsSection) {
      throw new NotFoundException('Why choose us section not found');
    }

    const [formatted] = await this.formatMany([whyChooseUsSection], lang);

    return formatted;
  }

  async findByModuleSlug(moduleSlug: string, lang?: string) {
    return this.findAll(lang, moduleSlug);
  }

  async update(id: number, dto: UpdateWhyChooseUsSectionDto) {
    const whyChooseUsSection = await this.whyChooseUsSectionRepository.findOne({
      where: { id },
    });

    if (!whyChooseUsSection) {
      throw new NotFoundException('Why choose us section not found');
    }

    const moduleId =
      dto.moduleId || dto.moduleSlug
        ? await this.resolveModuleId(dto.moduleId, dto.moduleSlug)
        : whyChooseUsSection.moduleId;

    await this.whyChooseUsSectionRepository.update(id, {
      moduleId,
      slug: dto.slug ?? whyChooseUsSection.slug,
      priority: dto.priority ?? whyChooseUsSection.priority,
      isActive: dto.isActive ?? whyChooseUsSection.isActive,
    });

    await this.translationsService.upsertTranslations(
      TranslationModelType.MODULE_WHY_CHOOSE_US_SECTION,
      id,
      dto.translations || {},
    );

    if (Object.prototype.hasOwnProperty.call(dto, 'features')) {
      await this.replaceFeatures(id, dto.features);
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    const whyChooseUsSection = await this.whyChooseUsSectionRepository.findOne({
      where: { id },
      relations: {
        features: true,
      },
    });

    if (!whyChooseUsSection) {
      throw new NotFoundException('Why choose us section not found');
    }

    await this.deleteFeatures(whyChooseUsSection.features || []);

    await this.whyChooseUsSectionRepository.delete(id);

    await this.translationsService.deleteByModel(
      TranslationModelType.MODULE_WHY_CHOOSE_US_SECTION,
      id,
    );

    return {
      success: true,
      message: 'Why choose us section deleted successfully',
    };
  }

  /**
   * Replaces the whole features list of a why choose us section.
   * Passing undefined keeps the existing features.
   */
  private async replaceFeatures(
    whyChooseUsSectionId: number,
    features?: WhyChooseUsFeatureDto[],
  ) {
    if (!features) {
      return;
    }

    const existingFeatures = await this.whyChooseUsFeatureRepository.find({
      where: { whyChooseUsSectionId },
    });

    await this.deleteFeatures(existingFeatures);

    for (const [index, feature] of features.entries()) {
      const saved = await this.whyChooseUsFeatureRepository.save(
        this.whyChooseUsFeatureRepository.create({
          whyChooseUsSectionId,
          slug: feature.slug,
          icon: feature.icon ?? null,
          priority: feature.priority ?? index + 1,
          isActive: feature.isActive ?? true,
        }),
      );

      await this.translationsService.upsertTranslations(
        TranslationModelType.MODULE_WHY_CHOOSE_US_FEATURE,
        saved.id,
        feature.translations || {},
      );
    }
  }

  private async deleteFeatures(features: ModuleWhyChooseUsFeature[]) {
    if (!features.length) {
      return;
    }

    const featureIds = features.map((feature) => feature.id);

    await this.whyChooseUsFeatureRepository.delete({ id: In(featureIds) });

    await this.translationsService.deleteByModelIds(
      TranslationModelType.MODULE_WHY_CHOOSE_US_FEATURE,
      featureIds,
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
    whyChooseUsSections: ModuleWhyChooseUsSection[],
    lang?: string,
  ) {
    const sectionIds = whyChooseUsSections.map((item) => item.id);

    const featureIds = whyChooseUsSections.flatMap((item) =>
      (item.features || []).map((feature) => feature.id),
    );

    const sectionTranslations = lang
      ? await this.translationsService.getTranslationByLang(
          TranslationModelType.MODULE_WHY_CHOOSE_US_SECTION,
          sectionIds,
          lang,
        )
      : await this.translationsService.getTranslations(
          TranslationModelType.MODULE_WHY_CHOOSE_US_SECTION,
          sectionIds,
        );

    const featureTranslations = lang
      ? await this.translationsService.getTranslationByLang(
          TranslationModelType.MODULE_WHY_CHOOSE_US_FEATURE,
          featureIds,
          lang,
        )
      : await this.translationsService.getTranslations(
          TranslationModelType.MODULE_WHY_CHOOSE_US_FEATURE,
          featureIds,
        );

    return whyChooseUsSections.map((item) =>
      this.formatWhyChooseUsSectionResponse(
        item,
        sectionTranslations,
        featureTranslations,
        lang,
      ),
    );
  }

  private formatWhyChooseUsSectionResponse(
    whyChooseUsSection: ModuleWhyChooseUsSection,
    sectionTranslations: any,
    featureTranslations: any,
    lang?: string,
  ) {
    const translations = sectionTranslations[whyChooseUsSection.id] || {};

    const features = (whyChooseUsSection.features || [])
      .sort((a, b) => a.priority - b.priority || Number(a.id) - Number(b.id))
      .map((feature) => {
        const currentFeatureTranslations =
          featureTranslations[feature.id] || {};

        return {
          ...feature,
          translations: lang ? undefined : currentFeatureTranslations,
          ...(lang
            ? {
                title: currentFeatureTranslations.title || '',
                description: currentFeatureTranslations.description || '',
              }
            : {}),
        };
      });

    return {
      ...whyChooseUsSection,
      module: whyChooseUsSection.module
        ? {
            id: whyChooseUsSection.module.id,
            slug: whyChooseUsSection.module.slug,
          }
        : null,
      features,
      translations: lang ? undefined : translations,
      ...(lang
        ? {
            eyebrow: translations.eyebrow || '',
            title: translations.title || '',
            description: translations.description || '',
          }
        : {}),
    };
  }
}
