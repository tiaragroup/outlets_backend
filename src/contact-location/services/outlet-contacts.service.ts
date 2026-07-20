import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OutletContact } from '../entities/outlet-contact.entity';
import { OutletModule } from '../../menu/entities/module.entity';
import { CreateOutletContactDto } from '../dto/create-outlet-contact.dto';
import { UpdateOutletContactDto } from '../dto/update-outlet-contact.dto';
import { TranslationsService } from '../../menu/services/translations.service';
import { TranslationModelType } from '../../menu/entities/translation.entity';

@Injectable()
export class OutletContactsService {
  constructor(
    @InjectRepository(OutletContact)
    private readonly outletContactRepository: Repository<OutletContact>,

    @InjectRepository(OutletModule)
    private readonly moduleRepository: Repository<OutletModule>,

    private readonly translationsService: TranslationsService,
  ) {}

  async create(dto: CreateOutletContactDto) {
    const moduleId = await this.resolveModuleId(dto.moduleId, dto.moduleSlug);

    const contact = this.outletContactRepository.create({
      moduleId,
      name: dto.name,
      phone: dto.phone ?? null,
      whatsappNumber: dto.whatsappNumber ?? null,
      whatsappUrl: dto.whatsappUrl ?? null,
      email: dto.email ?? null,
      websiteUrl: dto.websiteUrl ?? null,
      isActive: dto.isActive ?? true,
    });

    const saved = await this.outletContactRepository.save(contact);

    await this.translationsService.upsertTranslations(
      TranslationModelType.OUTLET_CONTACT,
      saved.id,
      this.withDefaultEnglishTranslation(dto.name, dto.translations),
    );

    return this.findOne(saved.id);
  }

  async findAll(lang?: string, moduleSlug?: string) {
    let moduleId: number | undefined;

    if (moduleSlug) {
      const module = await this.moduleRepository.findOne({
        where: { slug: moduleSlug },
      });

      if (!module) {
        throw new NotFoundException('Module not found');
      }

      moduleId = module.id;
    }

    const contacts = await this.outletContactRepository.find({
      where: moduleId ? { moduleId } : {},
      relations: {
        module: true,
      },
      order: {
        id: 'ASC',
      },
    });

    const ids = contacts.map((item) => item.id);

    const translations = lang
      ? await this.translationsService.getTranslationByLang(
          TranslationModelType.OUTLET_CONTACT,
          ids,
          lang,
        )
      : await this.translationsService.getTranslations(
          TranslationModelType.OUTLET_CONTACT,
          ids,
        );

    return contacts.map((item) =>
      this.formatContactResponse(item, translations, lang),
    );
  }

  async findOne(id: number, lang?: string) {
    const contact = await this.outletContactRepository.findOne({
      where: { id },
      relations: {
        module: true,
      },
    });

    if (!contact) {
      throw new NotFoundException('Outlet contact not found');
    }

    const translations = lang
      ? await this.translationsService.getTranslationByLang(
          TranslationModelType.OUTLET_CONTACT,
          [id],
          lang,
        )
      : await this.translationsService.getTranslations(
          TranslationModelType.OUTLET_CONTACT,
          [id],
        );

    return this.formatContactResponse(contact, translations, lang);
  }

  async findByModuleSlug(moduleSlug: string, lang?: string) {
    const module = await this.moduleRepository.findOne({
      where: { slug: moduleSlug },
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    const contact = await this.outletContactRepository.findOne({
      where: { moduleId: module.id },
      relations: {
        module: true,
      },
    });

    if (!contact) {
      throw new NotFoundException('Outlet contact not found');
    }

    return this.findOne(contact.id, lang);
  }

  async update(id: number, dto: UpdateOutletContactDto) {
    const contact = await this.outletContactRepository.findOne({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException('Outlet contact not found');
    }

    const moduleId =
      dto.moduleId || dto.moduleSlug
        ? await this.resolveModuleId(dto.moduleId, dto.moduleSlug)
        : contact.moduleId;

    const hasPhoneField = Object.prototype.hasOwnProperty.call(dto, 'phone');

    const hasWhatsappNumberField = Object.prototype.hasOwnProperty.call(
      dto,
      'whatsappNumber',
    );

    const hasWhatsappUrlField = Object.prototype.hasOwnProperty.call(
      dto,
      'whatsappUrl',
    );

    const hasEmailField = Object.prototype.hasOwnProperty.call(dto, 'email');

    const hasWebsiteUrlField = Object.prototype.hasOwnProperty.call(
      dto,
      'websiteUrl',
    );

    await this.outletContactRepository.update(id, {
      moduleId,
      name: dto.name ?? contact.name,

      // missing field = keep old value
      // null = remove value
      phone: hasPhoneField ? dto.phone ?? null : contact.phone,

      whatsappNumber: hasWhatsappNumberField
        ? dto.whatsappNumber ?? null
        : contact.whatsappNumber,

      whatsappUrl: hasWhatsappUrlField
        ? dto.whatsappUrl ?? null
        : contact.whatsappUrl,

      email: hasEmailField ? dto.email ?? null : contact.email,

      websiteUrl: hasWebsiteUrlField
        ? dto.websiteUrl ?? null
        : contact.websiteUrl,

      isActive: dto.isActive ?? contact.isActive,
    });

    await this.translationsService.upsertTranslations(
      TranslationModelType.OUTLET_CONTACT,
      id,
      this.withDefaultEnglishTranslation(
        dto.name ?? contact.name,
        dto.translations,
      ),
    );

    return this.findOne(id);
  }

  async remove(id: number) {
    const contact = await this.outletContactRepository.findOne({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException('Outlet contact not found');
    }

    await this.outletContactRepository.delete(id);

    await this.translationsService.deleteByModel(
      TranslationModelType.OUTLET_CONTACT,
      id,
    );

    return {
      success: true,
      message: 'Outlet contact deleted successfully',
    };
  }

  private async resolveModuleId(
    moduleId?: number,
    moduleSlug?: string,
  ): Promise<number | null> {
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

    return null;
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

  private formatContactResponse(
    contact: OutletContact,
    translations: any,
    lang?: string,
  ) {
    const contactTranslations = translations[contact.id] || {};

    return {
      ...contact,
      module: contact.module
        ? {
            id: contact.module.id,
            slug: contact.module.slug,
          }
        : null,
      translations: lang ? undefined : contactTranslations,
      ...(lang
        ? {
            name: contactTranslations.name || contact.name,
          }
        : {}),
    };
  }
}