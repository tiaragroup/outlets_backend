import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleLegalContent } from './entities/module-legal-content.entity';
import { OutletModule } from '../menu/entities/module.entity';
import { Translation } from '../menu/entities/translation.entity';
import { LegalContentsController } from './legal-contents.controller';
import { LegalContentsService } from './legal-contents.service';
import { TranslationsService } from '../menu/services/translations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ModuleLegalContent,
      OutletModule,
      Translation,
    ]),
  ],
  controllers: [LegalContentsController],
  providers: [LegalContentsService, TranslationsService],
  exports: [LegalContentsService],
})
export class LegalContentsModule {}