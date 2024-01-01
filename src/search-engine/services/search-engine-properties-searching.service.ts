import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { isNil } from 'lodash';
import { SEARCH_ENGINE_PROPERTIES_INDEX } from '../constants/search-engine.constant';

@Injectable()
export class SearchEnginePropertiesSearchingService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  private index = SEARCH_ENGINE_PROPERTIES_INDEX;

  async searchForProperties({
    query,
    location,
    numberOfRooms,
    priceMax,
    priceMin,
    propertyFlags,
    squareMetersMax,
    squareMetersMin,
    from = 0,
    size = 10,
  }: {
    query?: string | null;
    location?: string | null;
    numberOfRooms?: string | null;
    priceMax?: number | null;
    priceMin?: number | null;
    propertyFlags?: string | null;
    squareMetersMax?: number | null;
    squareMetersMin?: number | null;
    from?: number;
    size?: number;
  }) {
    const searchQuery = this.constructPropertySearchQuery({
      query,
      location,
      numberOfRooms,
      priceMax,
      priceMin,
      propertyFlags,
      squareMetersMax,
      squareMetersMin,
    });

    const searchMatches = await this.elasticsearchService.search<{
      _id: string;
    }>({
      index: this.index,
      query: searchQuery,
      from,
      size,
    });

    return searchMatches;
  }

  private constructPropertySearchQuery({
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
    priceMax?: number | null;
    priceMin?: number | null;
    propertyFlags?: string | null;
    squareMetersMax?: number | null;
    squareMetersMin?: number | null;
  }): QueryDslQueryContainer {
    const queryRootContainer: QueryDslQueryContainer = { bool: { must: [] } };

    const queryMustContainer: QueryDslQueryContainer[] = [];

    this.pushQueryConditionToQuery({
      query,
      queryConditions: queryMustContainer,
    });

    this.pushLocationConditionToQuery({
      location,
      queryConditions: queryMustContainer,
    });

    this.pushNumberOfRoomsConditionToQuery({
      numberOfRooms,
      queryConditions: queryMustContainer,
    });

    this.pushPropertyFlagsConditionToQuery({
      propertyFlags,
      queryConditions: queryMustContainer,
    });

    this.pushPriceMinConditionToQuery({
      priceMin,
      queryConditions: queryMustContainer,
    });

    this.pushPriceMaxConditionToQuery({
      priceMax,
      queryConditions: queryMustContainer,
    });

    this.pushSquareMetersMinConditionToQuery({
      squareMetersMin,
      queryConditions: queryMustContainer,
    });

    this.pushSquareMetersMaxConditionToQuery({
      squareMetersMax,
      queryConditions: queryMustContainer,
    });

    if (!isNil(queryRootContainer.bool?.must)) {
      queryRootContainer.bool.must = queryMustContainer;
    }

    return queryRootContainer;
  }

  private pushQueryConditionToQuery({
    query,
    queryConditions,
  }: {
    query?: string | null;
    queryConditions: QueryDslQueryContainer[];
  }) {
    if (!isNil(query)) {
      queryConditions.push({
        combined_fields: {
          query,
          fields: [
            'title',
            'description',
            'location',
            'propertyType',
            'propertyFlags',
          ],
          operator: 'and',
        },
      });
    }
  }

  private pushLocationConditionToQuery({
    location,
    queryConditions,
  }: {
    location?: string | null;
    queryConditions: QueryDslQueryContainer[];
  }) {
    if (!isNil(location)) {
      queryConditions.push({
        match: {
          location,
        },
      });
    }
  }

  private pushNumberOfRoomsConditionToQuery({
    numberOfRooms,
    queryConditions,
  }: {
    numberOfRooms?: string | null;
    queryConditions: QueryDslQueryContainer[];
  }) {
    if (!isNil(numberOfRooms)) {
      queryConditions.push({
        match: {
          numberOfRooms,
        },
      });
    }
  }

  private pushPropertyFlagsConditionToQuery({
    propertyFlags,
    queryConditions,
  }: {
    propertyFlags?: string | null;
    queryConditions: QueryDslQueryContainer[];
  }) {
    if (!isNil(propertyFlags)) {
      queryConditions.push({
        match: {
          propertyFlags,
        },
      });
    }
  }

  private pushPriceMinConditionToQuery({
    priceMin,
    queryConditions,
  }: {
    priceMin?: number | null;
    queryConditions: QueryDslQueryContainer[];
  }) {
    if (!isNil(priceMin)) {
      queryConditions.push({
        range: {
          price: { gte: priceMin },
        },
      });
    }
  }

  private pushPriceMaxConditionToQuery({
    priceMax,
    queryConditions,
  }: {
    priceMax?: number | null;
    queryConditions: QueryDslQueryContainer[];
  }) {
    if (!isNil(priceMax)) {
      queryConditions.push({
        range: {
          price: { lte: priceMax },
        },
      });
    }
  }

  private pushSquareMetersMinConditionToQuery({
    squareMetersMin,
    queryConditions,
  }: {
    squareMetersMin?: number | null;
    queryConditions: QueryDslQueryContainer[];
  }) {
    if (!isNil(squareMetersMin)) {
      queryConditions.push({
        range: {
          squareMeters: { gte: squareMetersMin },
        },
      });
    }
  }

  private pushSquareMetersMaxConditionToQuery({
    squareMetersMax,
    queryConditions,
  }: {
    squareMetersMax?: number | null;
    queryConditions: QueryDslQueryContainer[];
  }) {
    if (!isNil(squareMetersMax)) {
      queryConditions.push({
        range: {
          squareMeters: { lte: squareMetersMax },
        },
      });
    }
  }
}
