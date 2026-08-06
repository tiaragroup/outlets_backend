import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleHeroSection } from './entities/module-hero-section.entity';
import { OutletModule } from '../menu/entities/module.entity';
import { Translation } from '../menu/entities/translation.entity';
import { HeroSectionsController } from './hero-sections.controller';
import { HeroSectionsService } from './hero-sections.service';
import { TranslationsService } from '../menu/services/translations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ModuleHeroSection,
      OutletModule,
      Translation,
    ]),
  ],
  controllers: [HeroSectionsController],
  providers: [HeroSectionsService, TranslationsService],
  exports: [HeroSectionsService],
})
export class HeroSectionsModule {}