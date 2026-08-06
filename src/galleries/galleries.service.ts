import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModuleGallery } from './entities/module-gallery.entity';
import { OutletModule } from '../menu/entities/module.entity';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';

@Injectable()
export class GalleriesService {
  constructor(
    @InjectRepository(ModuleGallery)
    private readonly galleryRepository: Repository<ModuleGallery>,

    @InjectRepository(OutletModule)
    private readonly moduleRepository: Repository<OutletModule>,
  ) {}

  async create(dto: CreateGalleryDto) {
    const moduleId = await this.resolveModuleId(dto.moduleId, dto.moduleSlug);

    const gallery = this.galleryRepository.create({
      moduleId,
      slug: dto.slug ?? null,
      image: dto.image ?? null,
      priority: dto.priority ?? 0,
      isActive: dto.isActive ?? true,
    });

    const saved = await this.galleryRepository.save(gallery);

    return this.findOne(saved.id);
  }

  async findAll(moduleSlug?: string, moduleId?: number) {
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

    const galleries = await this.galleryRepository.find({
      where,
      relations: {
        module: true,
      },
      order: {
        priority: 'ASC',
        id: 'ASC',
      },
    });

    return galleries.map((item) => this.formatGalleryResponse(item));
  }

  async findOne(id: number) {
    const gallery = await this.galleryRepository.findOne({
      where: { id },
      relations: {
        module: true,
      },
    });

    if (!gallery) {
      throw new NotFoundException('Gallery image not found');
    }

    return this.formatGalleryResponse(gallery);
  }

  async findByModuleSlug(moduleSlug: string) {
    return this.findAll(moduleSlug);
  }

  async update(id: number, dto: UpdateGalleryDto) {
    const gallery = await this.galleryRepository.findOne({
      where: { id },
    });

    if (!gallery) {
      throw new NotFoundException('Gallery image not found');
    }

    const moduleId =
      dto.moduleId || dto.moduleSlug
        ? await this.resolveModuleId(dto.moduleId, dto.moduleSlug)
        : gallery.moduleId;

    /**
     * Important:
     * - image missing from body => keep old image
     * - image string => update image
     * - image null => remove image
     */
    const hasImageField = Object.prototype.hasOwnProperty.call(dto, 'image');

    await this.galleryRepository.update(id, {
      moduleId,
      slug: dto.slug ?? gallery.slug,
      image: hasImageField ? dto.image ?? null : gallery.image,
      priority: dto.priority ?? gallery.priority,
      isActive: dto.isActive ?? gallery.isActive,
    });

    return this.findOne(id);
  }

  async removeImage(id: number) {
    const gallery = await this.galleryRepository.findOne({
      where: { id },
    });

    if (!gallery) {
      throw new NotFoundException('Gallery image not found');
    }

    await this.galleryRepository.update(id, {
      image: null,
    });

    return {
      success: true,
      message: 'Gallery image removed successfully',
      id,
      image: null,
    };
  }

  async remove(id: number) {
    const gallery = await this.galleryRepository.findOne({
      where: { id },
    });

    if (!gallery) {
      throw new NotFoundException('Gallery image not found');
    }

    await this.galleryRepository.delete(id);

    return {
      success: true,
      message: 'Gallery image deleted successfully',
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

  private formatGalleryResponse(gallery: ModuleGallery) {
    return {
      ...gallery,
      module: gallery.module
        ? {
            id: gallery.module.id,
            slug: gallery.module.slug,
          }
        : null,
    };
  }
}
