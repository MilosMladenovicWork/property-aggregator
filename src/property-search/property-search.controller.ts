import { Controller, Get, Post, Query } from '@nestjs/common';
import { Property } from 'src/property/schema/property.schema';
import { PropertySearchSearchRequestQuery } from './dtos/property-search-search-request-query.dto';
import { PropertySearchDataGettingService } from './services/property-search-data-getting.service';
import { PropertySearchDataInsertionService } from './services/property-search-data-insertion.service';

@Controller('property-search')
export class PropertySearchController {
  constructor(
    private readonly propertySearchDataInsertionService: PropertySearchDataInsertionService,
    private readonly propertySearchDataGettingService: PropertySearchDataGettingService,
  ) {}

  @Get()
  async search(
    @Query() propertySearchSearchRequestQuery: PropertySearchSearchRequestQuery,
  ): Promise<Property[]> {
    const data = await this.propertySearchDataGettingService.search({
      query: propertySearchSearchRequestQuery.query,
    });

    return data;
  }

  @Post('sync-properties-from-db')
  syncPropertiesWithSearchEngine(): string {
    this.propertySearchDataInsertionService.insertDataFromDb();

    return 'Inserting data';
  }
}
