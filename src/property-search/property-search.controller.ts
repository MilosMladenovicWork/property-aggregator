import { Controller, Post } from '@nestjs/common';
import { PropertySearchDataInsertionService } from './services/property-search-data-insertion.service';

@Controller('property-search')
export class PropertySearchController {
  constructor(
    private readonly propertySearchDataInsertionService: PropertySearchDataInsertionService,
  ) {}

  @Post('sync-properties-from-db')
  syncPropertiesWithSearchEngine(): string {
    this.propertySearchDataInsertionService.insertDataFromDb();

    return 'Inserting data';
  }
}
