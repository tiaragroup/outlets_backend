import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleStorySection } from './entities/module-story-section.entity';
import { ModuleStoryStat } from './entities/module-story-stat.entity';
import { OutletModule } from '../menu/entities/module.entity';
import { Translation } from '../menu/entities/translation.entity';
import { StorySectionsController } from './story-sections.controller';
import { StorySectionsService } from './story-sections.service';
import { TranslationsService } from '../menu/services/translations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ModuleStorySection,
      ModuleStoryStat,
      OutletModule,
      Translation,
    ]),
  ],
  controllers: [StorySectionsController],
  providers: [StorySectionsService, TranslationsService],
  exports: [StorySectionsService],
})
export class StorySectionsModule {}
