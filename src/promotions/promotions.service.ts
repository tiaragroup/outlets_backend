import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModulePromotion } from './entities/module-promotion.entity';
import { OutletModule } from '../menu/entities/module.entity';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { TranslationsService } from '../menu/services/translations.service';
import { TranslationModelType } from '../menu/entities/translation.entity';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(ModulePromotion)
    private readonly promotionRepository: Repository<ModulePromotion>,

    @InjectRepository(OutletModule)
    private readonly moduleRepository: Repository<OutletModule>,

    private readonly translationsService: TranslationsService,
  ) {}

  async create(dto: CreatePromotionDto) {
    const moduleId = await this.resolveModuleId(dto.moduleId, dto.moduleSlug);

    const promotion = this.promotionRepository.create({
      moduleId,
      slug: dto.slug,
      backgroundImage: dto.backgroundImage ?? null,
      mobileBackgroundImage: dto.mobileBackgroundImage ?? null,
      buttonUrl: dto.buttonUrl ?? null,
      startsAt: dto.startsAt ? new Date(dto.startsAt) : null,
      endsAt: dto.endsAt ? new Date(dto.endsAt) : null,
      priority: dto.priority ?? 0,
      isActive: dto.isActive ?? true,
    });

    const saved = await this.promotionRepository.save(promotion);

    await this.translationsService.upsertTranslations(
      TranslationModelType.MODULE_PROMOTION,
      saved.id,
      dto.translations || {},
    );

    return this.findOne(saved.id);
  }

  async findAll(
    lang?: string,
    moduleSlug?: string,
    moduleId?: number,
    activeOnly?: boolean,
  ) {
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

    if (activeOnly) {
      where.isActive = true;
    }

    const promotions = await this.promotionRepository.find({
      where,
      relations: {
        module: true,
      },
      order: {
        priority: 'ASC',
        id: 'ASC',
      },
    });

    const visiblePromotions = activeOnly
      ? promotions.filter((promotion) => this.isRunning(promotion))
      : promotions;

    return this.formatMany(visiblePromotions, lang);
  }

  async findOne(id: number, lang?: string) {
    const promotion = await this.promotionRepository.findOne({
      where: { id },
      relations: {
        module: true,
      },
    });

    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }

    const [formatted] = await this.formatMany([promotion], lang);

    return formatted;
  }

  async findByModuleSlug(
    moduleSlug: string,
    lang?: string,
    activeOnly?: boolean,
  ) {
    return this.findAll(lang, moduleSlug, undefined, activeOnly);
  }

  async update(id: number, dto: UpdatePromotionDto) {
    const promotion = await this.promotionRepository.findOne({
      where: { id },
    });

    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }

    const moduleId =
      dto.moduleId || dto.moduleSlug
        ? await this.resolveModuleId(dto.moduleId, dto.moduleSlug)
        : promotion.moduleId;

    const hasBackgroundImageField = Object.prototype.hasOwnProperty.call(
      dto,
      'backgroundImage',
    );

    const hasMobileBackgroundImageField = Object.prototype.hasOwnProperty.call(
      dto,
      'mobileBackgroundImage',
    );

    const hasButtonUrlField = Object.prototype.hasOwnProperty.call(
      dto,
      'buttonUrl',
    );

    const hasStartsAtField = Object.prototype.hasOwnProperty.call(
      dto,
      'startsAt',
    );

    const hasEndsAtField = Object.prototype.hasOwnProperty.call(dto, 'endsAt');

    await this.promotionRepository.update(id, {
      moduleId,
      slug: dto.slug ?? promotion.slug,

      backgroundImage: hasBackgroundImageField
        ? (dto.backgroundImage ?? null)
        : promotion.backgroundImage,

      mobileBackgroundImage: hasMobileBackgroundImageField
        ? (dto.mobileBackgroundImage ?? null)
        : promotion.mobileBackgroundImage,

      buttonUrl: hasButtonUrlField
        ? (dto.buttonUrl ?? null)
        : promotion.buttonUrl,

      startsAt: hasStartsAtField
        ? dto.startsAt
          ? new Date(dto.startsAt)
          : null
        : promotion.startsAt,

      endsAt: hasEndsAtField
        ? dto.endsAt
          ? new Date(dto.endsAt)
          : null
        : promotion.endsAt,

      priority: dto.priority ?? promotion.priority,
      isActive: dto.isActive ?? promotion.isActive,
    });

    await this.translationsService.upsertTranslations(
      TranslationModelType.MODULE_PROMOTION,
      id,
      dto.translations || {},
    );

    return this.findOne(id);
  }

  async remove(id: number) {
    const promotion = await this.promotionRepository.findOne({
      where: { id },
    });

    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }

    await this.promotionRepository.delete(id);

    await this.translationsService.deleteByModel(
      TranslationModelType.MODULE_PROMOTION,
      id,
    );

    return {
      success: true,
      message: 'Promotion deleted successfully',
    };
  }

  /**
   * A promotion is running when now falls inside its schedule.
   * Missing startsAt or endsAt means that side is open ended.
   */
  private isRunning(promotion: ModulePromotion, now = new Date()) {
    if (promotion.startsAt && new Date(promotion.startsAt) > now) {
      return false;
    }

    if (promotion.endsAt && new Date(promotion.endsAt) < now) {
      return false;
    }

    return true;
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

  private async formatMany(promotions: ModulePromotion[], lang?: string) {
    const promotionIds = promotions.map((item) => item.id);

    const promotionTranslations = lang
      ? await this.translationsService.getTranslationByLang(
          TranslationModelType.MODULE_PROMOTION,
          promotionIds,
          lang,
        )
      : await this.translationsService.getTranslations(
          TranslationModelType.MODULE_PROMOTION,
          promotionIds,
        );

    return promotions.map((item) =>
      this.formatPromotionResponse(item, promotionTranslations, lang),
    );
  }

  private formatPromotionResponse(
    promotion: ModulePromotion,
    promotionTranslations: any,
    lang?: string,
  ) {
    const translations = promotionTranslations[promotion.id] || {};

    return {
      ...promotion,
      module: promotion.module
        ? {
            id: promotion.module.id,
            slug: promotion.module.slug,
          }
        : null,
      isRunning: this.isRunning(promotion),
      translations: lang ? undefined : translations,
      ...(lang
        ? {
            eyebrow: translations.eyebrow || '',
            title: translations.title || '',
            description: translations.description || '',
            buttonLabel: translations.button_label || '',
            imageAlt: translations.image_alt || '',
            imageCredit: translations.image_credit || '',
          }
        : {}),
    };
  }
}
