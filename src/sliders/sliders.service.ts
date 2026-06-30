import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModuleSlider } from './entities/module-slider.entity';
import { OutletModule } from '../menu/entities/module.entity';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { TranslationsService } from '../menu/services/translations.service';
import { TranslationModelType } from '../menu/entities/translation.entity';

@Injectable()
export class SlidersService {
  constructor(
    @InjectRepository(ModuleSlider)
    private readonly sliderRepository: Repository<ModuleSlider>,

    @InjectRepository(OutletModule)
    private readonly moduleRepository: Repository<OutletModule>,

    private readonly translationsService: TranslationsService,
  ) {}

  async create(dto: CreateSliderDto) {
    const moduleId = await this.resolveModuleId(dto.moduleId, dto.moduleSlug);

    const slider = this.sliderRepository.create({
      moduleId,
      slug: dto.slug,
      image: dto.image ?? null,
      mobileImage: dto.mobileImage ?? null,
      buttonUrl: dto.buttonUrl ?? null,
      priority: dto.priority ?? 0,
      isActive: dto.isActive ?? true,
    });

    const saved = await this.sliderRepository.save(slider);

    await this.translationsService.upsertTranslations(
      TranslationModelType.MODULE_SLIDER,
      saved.id,
      dto.translations,
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

    const sliders = await this.sliderRepository.find({
      where,
      relations: {
        module: true,
      },
      order: {
        priority: 'ASC',
        id: 'ASC',
      },
    });

    const ids = sliders.map((item) => item.id);

    const translations = lang
      ? await this.translationsService.getTranslationByLang(
          TranslationModelType.MODULE_SLIDER,
          ids,
          lang,
        )
      : await this.translationsService.getTranslations(
          TranslationModelType.MODULE_SLIDER,
          ids,
        );

    return sliders.map((item) =>
      this.formatSliderResponse(item, translations, lang),
    );
  }

  async findOne(id: number, lang?: string) {
    const slider = await this.sliderRepository.findOne({
      where: { id },
      relations: {
        module: true,
      },
    });

    if (!slider) {
      throw new NotFoundException('Slider not found');
    }

    const translations = lang
      ? await this.translationsService.getTranslationByLang(
          TranslationModelType.MODULE_SLIDER,
          [id],
          lang,
        )
      : await this.translationsService.getTranslations(
          TranslationModelType.MODULE_SLIDER,
          [id],
        );

    return this.formatSliderResponse(slider, translations, lang);
  }

  async findByModuleSlug(moduleSlug: string, lang?: string) {
    return this.findAll(lang, moduleSlug);
  }

  async update(id: number, dto: UpdateSliderDto) {
    const slider = await this.sliderRepository.findOne({
      where: { id },
    });

    if (!slider) {
      throw new NotFoundException('Slider not found');
    }

    const moduleId =
      dto.moduleId || dto.moduleSlug
        ? await this.resolveModuleId(dto.moduleId, dto.moduleSlug)
        : slider.moduleId;

    await this.sliderRepository.update(id, {
      moduleId,
      slug: dto.slug ?? slider.slug,
      image: dto.image ?? slider.image,
      mobileImage: dto.mobileImage ?? slider.mobileImage,
      buttonUrl: dto.buttonUrl ?? slider.buttonUrl,
      priority: dto.priority ?? slider.priority,
      isActive: dto.isActive ?? slider.isActive,
    });

    await this.translationsService.upsertTranslations(
      TranslationModelType.MODULE_SLIDER,
      id,
      dto.translations,
    );

    return this.findOne(id);
  }

  async remove(id: number) {
    const slider = await this.sliderRepository.findOne({
      where: { id },
    });

    if (!slider) {
      throw new NotFoundException('Slider not found');
    }

    await this.sliderRepository.delete(id);

    await this.translationsService.deleteByModel(
      TranslationModelType.MODULE_SLIDER,
      id,
    );

    return {
      success: true,
      message: 'Slider deleted successfully',
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

  private formatSliderResponse(
    slider: ModuleSlider,
    translations: any,
    lang?: string,
  ) {
    const sliderTranslations = translations[slider.id] || {};

    return {
      ...slider,
      module: slider.module
        ? {
            id: slider.module.id,
            slug: slider.module.slug,
          }
        : null,
      translations: lang ? undefined : sliderTranslations,
      ...(lang
        ? {
            eyebrow: sliderTranslations.eyebrow || '',
            title: sliderTranslations.title || '',
            highlightedText: sliderTranslations.highlighted_text || '',
            description: sliderTranslations.description || '',
            buttonText: sliderTranslations.button_text || '',
            badgeTitle: sliderTranslations.badge_title || '',
            badgeSubtitle: sliderTranslations.badge_subtitle || '',
          }
        : {}),
    };
  }
}