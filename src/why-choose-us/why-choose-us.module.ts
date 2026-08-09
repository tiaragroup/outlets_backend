import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleWhyChooseUsSection } from './entities/module-why-choose-us-section.entity';
import { ModuleWhyChooseUsFeature } from './entities/module-why-choose-us-feature.entity';
import { OutletModule } from '../menu/entities/module.entity';
import { Translation } from '../menu/entities/translation.entity';
import { WhyChooseUsController } from './why-choose-us.controller';
import { WhyChooseUsService } from './why-choose-us.service';
import { TranslationsService } from '../menu/services/translations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ModuleWhyChooseUsSection,
      ModuleWhyChooseUsFeature,
      OutletModule,
      Translation,
    ]),
  ],
  controllers: [WhyChooseUsController],
  providers: [WhyChooseUsService, TranslationsService],
  exports: [WhyChooseUsService],
})
export class WhyChooseUsModule {}
