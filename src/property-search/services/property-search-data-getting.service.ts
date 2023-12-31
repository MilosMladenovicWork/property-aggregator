import { Injectable } from '@nestjs/common';
import { Property } from 'src/property/schema/property.schema';
import { PropertyService } from 'src/property/services/property.service';
import { SearchEnginePropertiesSearchingService } from 'src/search-engine/services/search-engine-properties-searching.service';

@Injectable()
export class PropertySearchDataGettingService {
  constructor(
    private readonly searchEnginePropertiesSearchingService: SearchEnginePropertiesSearchingService,
    private readonly propertyService: PropertyService,
  ) {}

  async search({
    query,
    location,
    numberOfRooms,
    priceMax,
    priceMin,
    propertyFlags,
    squareMetersMax,
    squareMetersMin,
  }: {
    query?: string | null;
    location?: string | null;
    numberOfRooms?: string | null;
    priceMax?: string | null;
    priceMin?: string | null;
    propertyFlags?: string | null;
    squareMetersMax?: string | null;
    squareMetersMin?: string | null;
  }): Promise<Property[]> {
    const searchMatches =
      await this.searchEnginePropertiesSearchingService.searchForProperties({
        query,
        location,
        numberOfRooms,
        priceMax,
        priceMin,
        propertyFlags,
        squareMetersMax,
        squareMetersMin,
        from: 0,
        size: 100,
      });

    const urls = searchMatches.hits.hits.map(({ _id }) => _id);

    return this.propertyService.getAllPropertiesForSearchResults({ urls });
  }
}
