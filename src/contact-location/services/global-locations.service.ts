import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GlobalLocation } from '../entities/global-location.entity';
import { CreateGlobalLocationDto } from '../dto/create-global-location.dto';
import { UpdateGlobalLocationDto } from '../dto/update-global-location.dto';
import { TranslationsService } from '../../menu/services/translations.service';
import { TranslationModelType } from '../../menu/entities/translation.entity';

@Injectable()
export class GlobalLocationsService {
  constructor(
    @InjectRepository(GlobalLocation)
    private readonly globalLocationRepository: Repository<GlobalLocation>,

    private readonly translationsService: TranslationsService,
  ) {}

  async create(dto: CreateGlobalLocationDto) {
    const location = this.globalLocationRepository.create({
      address: dto.address,
      city: dto.city,
      country: dto.country,
      mapUrl: dto.mapUrl,
      latitude: dto.latitude,
      longitude: dto.longitude,
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

  async findAll(lang?: string) {
    const locations = await this.globalLocationRepository.find({
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

  async update(id: number, dto: UpdateGlobalLocationDto) {
    const location = await this.globalLocationRepository.findOne({
      where: { id },
    });

    if (!location) {
      throw new NotFoundException('Global location not found');
    }

    await this.globalLocationRepository.update(id, {
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

  private withDefaultTranslations(
    location: GlobalLocation,
    translations?: Record<string, Record<string, string>>,
  ) {
    return {
      ...(translations || {}),
      en: {
        ...(translations?.en || {}),
        address: translations?.en?.address || location.address,
        city: translations?.en?.city || location.city,
        country: translations?.en?.country || location.country,
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