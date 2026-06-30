import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialLink } from './entities/social-link.entity';
import { OutletModule } from '../menu/entities/module.entity';
import { CreateSocialLinkDto } from './dto/create-social-link.dto';
import { UpdateSocialLinkDto } from './dto/update-social-link.dto';
import { TranslationsService } from '../menu/services/translations.service';
import { TranslationModelType } from '../menu/entities/translation.entity';

@Injectable()
export class SocialLinksService {
  constructor(
    @InjectRepository(SocialLink)
    private readonly socialLinkRepository: Repository<SocialLink>,

    @InjectRepository(OutletModule)
    private readonly moduleRepository: Repository<OutletModule>,

    private readonly translationsService: TranslationsService,
  ) {}

  async create(dto: CreateSocialLinkDto) {
    const moduleId = await this.resolveModuleId(dto.moduleId, dto.moduleSlug);

    const socialLink = this.socialLinkRepository.create({
      moduleId,
      name: dto.name,
      icon: dto.icon ?? null,
      url: dto.url,
      isActive: dto.isActive ?? true,
    });

    const saved = await this.socialLinkRepository.save(socialLink);

    await this.translationsService.upsertTranslations(
      TranslationModelType.SOCIAL_LINK,
      saved.id,
      this.withDefaultEnglishTranslation(dto.name, dto.translations),
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

    const socialLinks = await this.socialLinkRepository.find({
      where,
      relations: {
        module: true,
      },
      order: {
        id: 'ASC',
      },
    });

    const ids = socialLinks.map((item) => item.id);

    const translations = lang
      ? await this.translationsService.getTranslationByLang(
          TranslationModelType.SOCIAL_LINK,
          ids,
          lang,
        )
      : await this.translationsService.getTranslations(
          TranslationModelType.SOCIAL_LINK,
          ids,
        );

    return socialLinks.map((item) =>
      this.formatSocialLinkResponse(item, translations, lang),
    );
  }

  async findOne(id: number, lang?: string) {
    const socialLink = await this.socialLinkRepository.findOne({
      where: { id },
      relations: {
        module: true,
      },
    });

    if (!socialLink) {
      throw new NotFoundException('Social link not found');
    }

    const translations = lang
      ? await this.translationsService.getTranslationByLang(
          TranslationModelType.SOCIAL_LINK,
          [id],
          lang,
        )
      : await this.translationsService.getTranslations(
          TranslationModelType.SOCIAL_LINK,
          [id],
        );

    return this.formatSocialLinkResponse(socialLink, translations, lang);
  }

  async findByModuleSlug(moduleSlug: string, lang?: string) {
    const module = await this.moduleRepository.findOne({
      where: { slug: moduleSlug },
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    return this.findAll(lang, moduleSlug);
  }

  async update(id: number, dto: UpdateSocialLinkDto) {
    const socialLink = await this.socialLinkRepository.findOne({
      where: { id },
    });

    if (!socialLink) {
      throw new NotFoundException('Social link not found');
    }

    const moduleId =
      dto.moduleId || dto.moduleSlug
        ? await this.resolveModuleId(dto.moduleId, dto.moduleSlug)
        : socialLink.moduleId;

    await this.socialLinkRepository.update(id, {
      moduleId,
      name: dto.name ?? socialLink.name,
      icon: dto.icon ?? socialLink.icon,
      url: dto.url ?? socialLink.url,
      isActive: dto.isActive ?? socialLink.isActive,
    });

    await this.translationsService.upsertTranslations(
      TranslationModelType.SOCIAL_LINK,
      id,
      this.withDefaultEnglishTranslation(
        dto.name ?? socialLink.name,
        dto.translations,
      ),
    );

    return this.findOne(id);
  }

  async remove(id: number) {
    const socialLink = await this.socialLinkRepository.findOne({
      where: { id },
    });

    if (!socialLink) {
      throw new NotFoundException('Social link not found');
    }

    await this.socialLinkRepository.delete(id);

    await this.translationsService.deleteByModel(
      TranslationModelType.SOCIAL_LINK,
      id,
    );

    return {
      success: true,
      message: 'Social link deleted successfully',
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

  private withDefaultEnglishTranslation(
    name: string,
    translations?: Record<string, Record<string, string>>,
  ) {
    return {
      ...(translations || {}),
      en: {
        ...(translations?.en || {}),
        name: translations?.en?.name || name,
      },
    };
  }

  private formatSocialLinkResponse(
    socialLink: SocialLink,
    translations: any,
    lang?: string,
  ) {
    const socialLinkTranslations = translations[socialLink.id] || {};

    return {
      ...socialLink,
      module: socialLink.module
        ? {
            id: socialLink.module.id,
            slug: socialLink.module.slug,
          }
        : null,
      translations: lang ? undefined : socialLinkTranslations,
      ...(lang
        ? {
            name: socialLinkTranslations.name || socialLink.name,
          }
        : {}),
    };
  }
}