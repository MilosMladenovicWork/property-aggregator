import { Module } from '@nestjs/common';
import { PropertyModule } from 'src/property/property.module';
import { SearchEngineModule } from 'src/search-engine/search-engine.module';
import { PropertySearchController } from './property-search.controller';
import { PropertySearchDataGettingService } from './services/property-search-data-getting.service';
import { PropertySearchDataInsertionService } from './services/property-search-data-insertion.service';

@Module({
  imports: [PropertyModule, SearchEngineModule],
  providers: [
    PropertySearchDataInsertionService,
    PropertySearchDataGettingService,
  ],
  controllers: [PropertySearchController],
})
export class PropertySearchModule {}
