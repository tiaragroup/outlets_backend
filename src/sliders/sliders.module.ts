import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleSlider } from './entities/module-slider.entity';
import { OutletModule } from '../menu/entities/module.entity';
import { Translation } from '../menu/entities/translation.entity';
import { SlidersController } from './sliders.controller';
import { SlidersService } from './sliders.service';
import { TranslationsService } from '../menu/services/translations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ModuleSlider,
      OutletModule,
      Translation,
    ]),
  ],
  controllers: [SlidersController],
  providers: [SlidersService, TranslationsService],
  exports: [SlidersService],
})
export class SlidersModule {}