import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GlobalLocation } from '../entities/global-location.entity';
import { OutletModule } from '../../menu/entities/module.entity';
import { CreateGlobalLocationDto } from '../dto/create-global-location.dto';
import { UpdateGlobalLocationDto } from '../dto/update-global-location.dto';
import { TranslationsService } from '../../menu/services/translations.service';
import { TranslationModelType } from '../../menu/entities/translation.entity';

@Injectable()
export class GlobalLocationsService {
  constructor(
    @InjectRepository(GlobalLocation)
    private readonly globalLocationRepository: Repository<GlobalLocation>,

    @InjectRepository(OutletModule)
    private readonly moduleRepository: Repository<OutletModule>,

    private readonly translationsService: TranslationsService,
  ) {}

  async create(dto: CreateGlobalLocationDto) {
    const moduleId = await this.resolveModuleId(dto.moduleId, dto.moduleSlug);

    const location = this.globalLocationRepository.create({
      moduleId,
      address: dto.address ?? null,
      city: dto.city ?? null,
      country: dto.country ?? null,
      mapUrl: dto.mapUrl ?? null,
      latitude: dto.latitude ?? null,
      longitude: dto.longitude ?? null,
      isActive: dto.isActive ?? true,
    });

    const saved = await this.globalLocationRepository.save(location);

    await this.translationsService.upsertTranslations(
      TranslationModelType.GLOBAL_LOCATION,
      saved.id,
      this.withDefaultTranslations(saved, dto.translations),
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

    const locations = await this.globalLocationRepository.find({
      where,
      relations: {
        module: true,
      },
      order: {
        id: 'ASC',
      },
    });

    const ids = locations.map((item) => item.id);

    const translations = lang
      ? await this.translationsService.getTranslationByLang(
          TranslationModelType.GLOBAL_LOCATION,
          ids,
          lang,
        )
      : await this.translationsService.getTranslations(
          TranslationModelType.GLOBAL_LOCATION,
          ids,
        );

    return locations.map((item) =>
      this.formatLocationResponse(item, translations, lang),
    );
  }

  async findOne(id: number, lang?: string) {
    const location = await this.globalLocationRepository.findOne({
      where: { id },
      relations: {
        module: true,
      },
    });

    if (!location) {
      throw new NotFoundException('Global location not found');
    }

    const translations = lang
      ? await this.translationsService.getTranslationByLang(
          TranslationModelType.GLOBAL_LOCATION,
          [id],
          lang,
        )
      : await this.translationsService.getTranslations(
          TranslationModelType.GLOBAL_LOCATION,
          [id],
        );

    return this.formatLocationResponse(location, translations, lang);
  }

  async findByModuleSlug(moduleSlug: string, lang?: string) {
    const module = await this.moduleRepository.findOne({
      where: { slug: moduleSlug },
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    const location = await this.globalLocationRepository.findOne({
      where: {
        moduleId: module.id,
      },
      relations: {
        module: true,
      },
    });

    if (!location) {
      throw new NotFoundException('Global location not found');
    }

    return this.findOne(location.id, lang);
  }

  async update(id: number, dto: UpdateGlobalLocationDto) {
    const location = await this.globalLocationRepository.findOne({
      where: { id },
    });

    if (!location) {
      throw new NotFoundException('Global location not found');
    }

    const moduleId =
      dto.moduleId || dto.moduleSlug
        ? await this.resolveModuleId(dto.moduleId, dto.moduleSlug)
        : location.moduleId;

    await this.globalLocationRepository.update(id, {
      moduleId,
      address: dto.address ?? location.address,
      city: dto.city ?? location.city,
      country: dto.country ?? location.country,
      mapUrl: dto.mapUrl ?? location.mapUrl,
      latitude: dto.latitude ?? location.latitude,
      longitude: dto.longitude ?? location.longitude,
      isActive: dto.isActive ?? location.isActive,
    });

    const updatedLocation = await this.globalLocationRepository.findOne({
      where: { id },
    });

    await this.translationsService.upsertTranslations(
      TranslationModelType.GLOBAL_LOCATION,
      id,
      this.withDefaultTranslations(updatedLocation!, dto.translations),
    );

    return this.findOne(id);
  }

  async remove(id: number) {
    const location = await this.globalLocationRepository.findOne({
      where: { id },
    });

    if (!location) {
      throw new NotFoundException('Global location not found');
    }

    await this.globalLocationRepository.delete(id);

    await this.translationsService.deleteByModel(
      TranslationModelType.GLOBAL_LOCATION,
      id,
    );

    return {
      success: true,
      message: 'Global location deleted successfully',
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

  private withDefaultTranslations(
    location: GlobalLocation,
    translations?: Record<string, Record<string, string>>,
  ) {
    return {
      ...(translations || {}),
      en: {
        ...(translations?.en || {}),
        address: translations?.en?.address || location.address || '',
        city: translations?.en?.city || location.city || '',
        country: translations?.en?.country || location.country || '',
      },
    };
  }

  private formatLocationResponse(
    location: GlobalLocation,
    translations: any,
    lang?: string,
  ) {
    const locationTranslations = translations[location.id] || {};

    return {
      ...location,
      module: location.module
        ? {
            id: location.module.id,
            slug: location.module.slug,
          }
        : null,
      translations: lang ? undefined : locationTranslations,
      ...(lang
        ? {
            address: locationTranslations.address || location.address,
            city: locationTranslations.city || location.city,
            country: locationTranslations.country || location.country,
          }
        : {}),
    };
  }
}