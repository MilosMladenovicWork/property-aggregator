import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PuppeteerModule } from 'nest-puppeteer';
import { PropertyController } from './property.controller';
import { Property, PropertySchema } from './schema/property.schema';
import { Property4ZidaTraversalService } from './services/property-4-zida-traversal.service';
import { Property4ZidaService } from './services/property-4-zida.service';
import { PropertyHaloOglasiDataExtractingService } from './services/property-halo-oglasi-data-extracting.service';
import { PropertyHaloOglasiTraversalService } from './services/property-halo-oglasi-traversal.service';
import { PropertyHaloOglasiService } from './services/property-halo-oglasi.service';
import { PropertyService } from './services/property.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Property.name, schema: PropertySchema },
    ]),
    PuppeteerModule.forRoot(),
  ],
  controllers: [PropertyController],
  providers: [
    PropertyService,
    PropertyHaloOglasiService,
    PropertyHaloOglasiTraversalService,
    PropertyHaloOglasiDataExtractingService,
    Property4ZidaService,
    Property4ZidaTraversalService,
  ],
  exports: [PropertyService],
})
export class PropertyModule {}
