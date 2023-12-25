import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PropertyHaloOglasiService } from './property-halo-oglasi.service';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { Property, PropertySchema } from './schema/property.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Property.name, schema: PropertySchema },
    ]),
  ],
  controllers: [PropertyController],
  providers: [PropertyService, PropertyHaloOglasiService],
})
export class PropertyModule {}
