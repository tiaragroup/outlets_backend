import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OutletModule } from '../entities/module.entity';
import { CreateModuleDto } from '../dto/create-module.dto';
import { UpdateModuleDto } from '../dto/update-module.dto';
import { TranslationsService } from './translations.service';
import { TranslationModelType } from '../entities/translation.entity';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(OutletModule)
    private readonly moduleRepository: Repository<OutletModule>,
    private readonly translationsService: TranslationsService,
  ) {}

  async create(dto: CreateModuleDto) {
    const module = this.moduleRepository.create({
      slug: dto.slug,
      priority: dto.priority ?? 0,
      logo: dto.logo,
      coverImage: dto.coverImage,
      authImage: dto.authImage,
      primaryColor: dto.primaryColor ?? dto.colors?.primary,
      secondaryColor: dto.secondaryColor ?? dto.colors?.secondary,
      lightColor: dto.lightColor ?? dto.colors?.light,
      textColor: dto.textColor ?? dto.colors?.text,
      isActive: dto.isActive ?? true,
    });

    const saved = await this.moduleRepository.save(module);

    await this.translationsService.upsertTranslations(
      TranslationModelType.MODULE,
      saved.id,
      dto.translations,
    );

    return this.findOne(saved.id);
  }

  async findAll(lang?: string) {
    const modules = await this.moduleRepository.find({
      order: {
        priority: 'ASC',
        id: 'ASC',
      },
    });

    const ids = modules.map((item) => item.id);
    const translations = lang
      ? await this.translationsService.getTranslationByLang(
          TranslationModelType.MODULE,
          ids,
          lang,
        )
      : await this.translationsService.getTranslations(
          TranslationModelType.MODULE,
          ids,
        );

    return modules.map((item) => ({
      ...item,
      translations: lang ? undefined : translations[item.id] || {},
      ...(lang ? translations[item.id] || {} : {}),
      colors: {
        primary: item.primaryColor,
        secondary: item.secondaryColor,
        light: item.lightColor,
        text: item.textColor,
      },
    }));
  }

  async findOne(id: number, lang?: string) {
    const module = await this.moduleRepository.findOne({
      where: { id },
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    const translations = lang
      ? await this.translationsService.getTranslationByLang(
          TranslationModelType.MODULE,
          [id],
          lang,
        )
      : await this.translationsService.getTranslations(
          TranslationModelType.MODULE,
          [id],
        );

    return {
      ...module,
      translations: lang ? undefined : translations[id] || {},
      ...(lang ? translations[id] || {} : {}),
      colors: {
        primary: module.primaryColor,
        secondary: module.secondaryColor,
        light: module.lightColor,
        text: module.textColor,
      },
    };
  }

  async update(id: number, dto: UpdateModuleDto) {
    const module = await this.moduleRepository.findOne({
      where: { id },
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    await this.moduleRepository.update(id, {
      slug: dto.slug ?? module.slug,
      priority: dto.priority ?? module.priority,
      logo: dto.logo ?? module.logo,
      coverImage: dto.coverImage ?? module.coverImage,
      authImage: dto.authImage ?? module.authImage,
      primaryColor: dto.primaryColor ?? dto.colors?.primary ?? module.primaryColor,
      secondaryColor:
        dto.secondaryColor ?? dto.colors?.secondary ?? module.secondaryColor,
      lightColor: dto.lightColor ?? dto.colors?.light ?? module.lightColor,
      textColor: dto.textColor ?? dto.colors?.text ?? module.textColor,
      isActive: dto.isActive ?? module.isActive,
    });

    await this.translationsService.upsertTranslations(
      TranslationModelType.MODULE,
      id,
      dto.translations,
    );

    return this.findOne(id);
  }

  async remove(id: number) {
    const module = await this.moduleRepository.findOne({
      where: { id },
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    await this.moduleRepository.delete(id);
    await this.translationsService.deleteByModel(TranslationModelType.MODULE, id);

    return {
      success: true,
      message: 'Module deleted successfully',
    };
  }
}