import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleGallery } from './entities/module-gallery.entity';
import { OutletModule } from '../menu/entities/module.entity';
import { GalleriesController } from './galleries.controller';
import { GalleriesService } from './galleries.service';

@Module({
  imports: [TypeOrmModule.forFeature([ModuleGallery, OutletModule])],
  controllers: [GalleriesController],
  providers: [GalleriesService],
  exports: [GalleriesService],
})
export class GalleriesModule {}
