import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PuppeteerModule } from 'nest-puppeteer';
import { PropertyHaloOglasiService } from './property-halo-oglasi.service';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { Property, PropertySchema } from './schema/property.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Property.name, schema: PropertySchema },
    ]),
    PuppeteerModule.forRoot(),
  ],
  controllers: [PropertyController],
  providers: [PropertyService, PropertyHaloOglasiService],
})
export class PropertyModule {}
