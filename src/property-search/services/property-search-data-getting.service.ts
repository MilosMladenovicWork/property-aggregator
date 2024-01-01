import { Injectable } from '@nestjs/common';
import { isNil } from 'lodash';
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
    from,
    size,
  }: {
    query?: string | null;
    location?: string | null;
    numberOfRooms?: string | null;
    priceMax?: number | null;
    priceMin?: number | null;
    propertyFlags?: string | null;
    squareMetersMax?: number | null;
    squareMetersMin?: number | null;
    from?: number | null;
    size?: number | null;
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
        from: !isNil(from) ? from : 0,
        size: !isNil(size) ? size : 100,
      });

    const urls = searchMatches.hits.hits.map(({ _id }) => _id);

    return this.propertyService.getAllPropertiesForSearchResults({ urls });
  }
}
