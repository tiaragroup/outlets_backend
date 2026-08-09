import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModulePromotion } from './entities/module-promotion.entity';
import { OutletModule } from '../menu/entities/module.entity';
import { Translation } from '../menu/entities/translation.entity';
import { PromotionsController } from './promotions.controller';
import { PromotionsService } from './promotions.service';
import { TranslationsService } from '../menu/services/translations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ModulePromotion, OutletModule, Translation]),
  ],
  controllers: [PromotionsController],
  providers: [PromotionsService, TranslationsService],
  exports: [PromotionsService],
})
export class PromotionsModule {}
