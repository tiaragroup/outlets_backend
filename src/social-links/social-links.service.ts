import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialLink } from './entities/social-link.entity';
import { CreateSocialLinkDto } from './dto/create-social-link.dto';
import { UpdateSocialLinkDto } from './dto/update-social-link.dto';
import { TranslationsService } from '../menu/services/translations.service';
import { TranslationModelType } from '../menu/entities/translation.entity';

@Injectable()
export class SocialLinksService {
  constructor(
    @InjectRepository(SocialLink)
    private readonly socialLinkRepository: Repository<SocialLink>,

    private readonly translationsService: TranslationsService,
  ) {}

  async create(dto: CreateSocialLinkDto) {
    const socialLink = this.socialLinkRepository.create({
      name: dto.name,
      icon: dto.icon,
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

  async findAll(lang?: string) {
    const socialLinks = await this.socialLinkRepository.find({
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

  async update(id: number, dto: UpdateSocialLinkDto) {
    const socialLink = await this.socialLinkRepository.findOne({
      where: { id },
    });

    if (!socialLink) {
      throw new NotFoundException('Social link not found');
    }

    await this.socialLinkRepository.update(id, {
      name: dto.name ?? socialLink.name,
      icon: dto.icon ?? socialLink.icon,
      url: dto.url ?? socialLink.url,
      isActive: dto.isActive ?? socialLink.isActive,
    });

    const translatedName = dto.name ?? socialLink.name;

    await this.translationsService.upsertTranslations(
      TranslationModelType.SOCIAL_LINK,
      id,
      this.withDefaultEnglishTranslation(translatedName, dto.translations),
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
    translations: Record<number, Record<string, Record<string, string>>> | Record<number, Record<string, string>>,
    lang?: string,
  ) {
    const socialLinkTranslations = translations[socialLink.id] || {};

    return {
      ...socialLink,
      translations: lang ? undefined : socialLinkTranslations,
      ...(lang
        ? {
            name:
              (socialLinkTranslations as Record<string, string>).name ||
              socialLink.name,
          }
        : {}),
    };
  }
}