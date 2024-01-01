import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PropertyService } from 'src/property/services/property.service';
import { SearchEnginePropertiesIndexingService } from 'src/search-engine/services/search-engine-properties-indexing.service';

@Injectable()
export class PropertySearchDataInsertionService {
  constructor(
    private propertyService: PropertyService,
    private searchEnginePropertiesIndexingService: SearchEnginePropertiesIndexingService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async insertDataFromDb() {
    await this.searchEnginePropertiesIndexingService.createPropertyIndex();

    const properties =
      await this.propertyService.getAllPropertiesForSearchIndexing();

    for (const property of properties) {
      console.log('Searh engine - Inserting data for property', {
        url: property.url,
      });

      await this.searchEnginePropertiesIndexingService.indexProperty({
        property,
      });
    }
  }
}
