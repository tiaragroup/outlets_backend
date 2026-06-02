import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  LegalContentType,
  ModuleLegalContent,
} from './entities/module-legal-content.entity';
import { OutletModule } from '../menu/entities/module.entity';
import { CreateLegalContentDto } from './dto/create-legal-content.dto';
import { UpdateLegalContentDto } from './dto/update-legal-content.dto';
import { TranslationsService } from '../menu/services/translations.service';
import { TranslationModelType } from '../menu/entities/translation.entity';

@Injectable()
export class LegalContentsService {
  constructor(
    @InjectRepository(ModuleLegalContent)
    private readonly legalContentRepository: Repository<ModuleLegalContent>,

    @InjectRepository(OutletModule)
    private readonly moduleRepository: Repository<OutletModule>,

    private readonly translationsService: TranslationsService,
  ) {}

  async create(dto: CreateLegalContentDto) {
    const moduleId = await this.resolveModuleId(dto.moduleId, dto.moduleSlug);

    const legalContent = this.legalContentRepository.create({
      moduleId,
      contentType: dto.contentType,
      slug: dto.slug,
      isActive: dto.isActive ?? true,
    });

    const saved = await this.legalContentRepository.save(legalContent);

    await this.translationsService.upsertTranslations(
      TranslationModelType.MODULE_LEGAL_CONTENT,
      saved.id,
      dto.translations,
    );

    return this.findOne(saved.id);
  }

  async findAll(lang?: string, moduleSlug?: string, contentType?: LegalContentType) {
    const where: any = {};

    if (moduleSlug) {
      const module = await this.moduleRepository.findOne({
        where: { slug: moduleSlug },
      });

      if (!module) {
        throw new NotFoundException('Module not found');
      }

      where.moduleId = module.id;
    }

    if (contentType) {
      where.contentType = contentType;
    }

    const contents = await this.legalContentRepository.find({
      where,
      relations: {
        module: true,
      },
      order: {
        id: 'ASC',
      },
    });

    const ids = contents.map((item) => item.id);

    const translations = lang
      ? await this.translationsService.getTranslationByLang(
          TranslationModelType.MODULE_LEGAL_CONTENT,
          ids,
          lang,
        )
      : await this.translationsService.getTranslations(
          TranslationModelType.MODULE_LEGAL_CONTENT,
          ids,
        );

    return contents.map((item) =>
      this.formatLegalContentResponse(item, translations, lang),
    );
  }

  async findOne(id: number, lang?: string) {
    const legalContent = await this.legalContentRepository.findOne({
      where: { id },
      relations: {
        module: true,
      },
    });

    if (!legalContent) {
      throw new NotFoundException('Legal content not found');
    }

    const translations = lang
      ? await this.translationsService.getTranslationByLang(
          TranslationModelType.MODULE_LEGAL_CONTENT,
          [id],
          lang,
        )
      : await this.translationsService.getTranslations(
          TranslationModelType.MODULE_LEGAL_CONTENT,
          [id],
        );

    return this.formatLegalContentResponse(legalContent, translations, lang);
  }

  async findByModuleAndType(
    moduleSlug: string,
    contentType: LegalContentType,
    lang?: string,
  ) {
    const module = await this.moduleRepository.findOne({
      where: { slug: moduleSlug },
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    const legalContent = await this.legalContentRepository.findOne({
      where: {
        moduleId: module.id,
        contentType,
        isActive: true,
      },
      relations: {
        module: true,
      },
    });

    if (!legalContent) {
      throw new NotFoundException('Legal content not found');
    }

    return this.findOne(legalContent.id, lang);
  }

  async update(id: number, dto: UpdateLegalContentDto) {
    const legalContent = await this.legalContentRepository.findOne({
      where: { id },
    });

    if (!legalContent) {
      throw new NotFoundException('Legal content not found');
    }

    const moduleId =
      dto.moduleId || dto.moduleSlug
        ? await this.resolveModuleId(dto.moduleId, dto.moduleSlug)
        : legalContent.moduleId;

    await this.legalContentRepository.update(id, {
      moduleId,
      contentType: dto.contentType ?? legalContent.contentType,
      slug: dto.slug ?? legalContent.slug,
      isActive: dto.isActive ?? legalContent.isActive,
    });

    await this.translationsService.upsertTranslations(
      TranslationModelType.MODULE_LEGAL_CONTENT,
      id,
      dto.translations,
    );

    return this.findOne(id);
  }

  async remove(id: number) {
    const legalContent = await this.legalContentRepository.findOne({
      where: { id },
    });

    if (!legalContent) {
      throw new NotFoundException('Legal content not found');
    }

    await this.legalContentRepository.delete(id);

    await this.translationsService.deleteByModel(
      TranslationModelType.MODULE_LEGAL_CONTENT,
      id,
    );

    return {
      success: true,
      message: 'Legal content deleted successfully',
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

  private formatLegalContentResponse(
    legalContent: ModuleLegalContent,
    translations: any,
    lang?: string,
  ) {
    const legalContentTranslations = translations[legalContent.id] || {};

    return {
      ...legalContent,
      module: legalContent.module
        ? {
            id: legalContent.module.id,
            slug: legalContent.module.slug,
          }
        : null,
      translations: lang ? undefined : legalContentTranslations,
      ...(lang
        ? {
            title: legalContentTranslations.title || '',
            content: legalContentTranslations.content || '',
          }
        : {}),
    };
  }
}