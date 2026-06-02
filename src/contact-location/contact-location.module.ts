import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalLocation } from './entities/global-location.entity';
import { OutletContact } from './entities/outlet-contact.entity';
import { OutletModule } from '../menu/entities/module.entity';
import { Translation } from '../menu/entities/translation.entity';
import { GlobalLocationsController } from './global-locations.controller';
import { OutletContactsController } from './outlet-contacts.controller';
import { GlobalLocationsService } from './services/global-locations.service';
import { OutletContactsService } from './services/outlet-contacts.service';
import { TranslationsService } from '../menu/services/translations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GlobalLocation,
      OutletContact,
      OutletModule,
      Translation,
    ]),
  ],
  controllers: [GlobalLocationsController, OutletContactsController],
  providers: [
    GlobalLocationsService,
    OutletContactsService,
    TranslationsService,
  ],
  exports: [GlobalLocationsService, OutletContactsService],
})
export class ContactLocationModule {}