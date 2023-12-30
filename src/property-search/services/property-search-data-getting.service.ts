import { Injectable } from '@nestjs/common';
import { Property } from 'src/property/schema/property.schema';
import { PropertyService } from 'src/property/services/property.service';
import { SearchEngineService } from 'src/search-engine/services/search-engine.service';

@Injectable()
export class PropertySearchDataGettingService {
  constructor(
    private readonly searchEngineService: SearchEngineService,
    private readonly propertyService: PropertyService,
  ) {}

  async search({ query }: { query?: string | null }): Promise<Property[]> {
    const searchMatches = await this.searchEngineService.searchForProperties({
      query,
      from: 0,
      size: 100,
    });

    const urls = searchMatches.hits.hits.map(({ _id }) => _id);

    return this.propertyService.getAllPropertiesForSearchResults({ urls });
  }
}
