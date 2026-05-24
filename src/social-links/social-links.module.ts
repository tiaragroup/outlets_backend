import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialLink } from './entities/social-link.entity';
import { Translation } from '../menu/entities/translation.entity';
import { SocialLinksController } from './social-links.controller';
import { SocialLinksService } from './social-links.service';
import { TranslationsService } from '../menu/services/translations.service';

@Module({
  imports: [TypeOrmModule.forFeature([SocialLink, Translation])],
  controllers: [SocialLinksController],
  providers: [SocialLinksService, TranslationsService],
  exports: [SocialLinksService],
})
export class SocialLinksModule {}