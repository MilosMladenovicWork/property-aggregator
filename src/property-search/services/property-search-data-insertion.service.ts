import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PropertyService } from 'src/property/services/property.service';
import { SearchEngineService } from 'src/search-engine/services/search-engine.service';

@Injectable()
export class PropertySearchDataInsertionService {
  constructor(
    private propertyService: PropertyService,
    private searchEngineService: SearchEngineService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async insertDataFromDb() {
    await this.searchEngineService.createPropertyIndex();

    const properties =
      await this.propertyService.getAllPropertiesForSearchIndexing();

    for (const property of properties) {
      await this.searchEngineService.indexProperty({
        property,
      });
    }
  }
}
