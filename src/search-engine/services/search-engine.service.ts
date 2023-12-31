import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { isNil } from 'lodash';
import { Property } from 'src/property/schema/property.schema';

@Injectable()
export class SearchEngineService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  private index = 'properties';

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
    priceMax?: string | null;
    priceMin?: string | null;
    propertyFlags?: string | null;
    squareMetersMax?: string | null;
    squareMetersMin?: string | null;
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
    priceMax?: string | null;
    priceMin?: string | null;
    propertyFlags?: string | null;
    squareMetersMax?: string | null;
    squareMetersMin?: string | null;
  }): QueryDslQueryContainer {
    const queryRootContainer: QueryDslQueryContainer = { bool: { must: [] } };

    const queryMustContainer: QueryDslQueryContainer[] = [];

    if (!isNil(query)) {
      queryMustContainer.push({
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

    if (!isNil(location)) {
      queryMustContainer.push({
        match: {
          location,
        },
      });
    }

    if (!isNil(numberOfRooms)) {
      queryMustContainer.push({
        match: {
          numberOfRooms,
        },
      });
    }

    if (!isNil(propertyFlags)) {
      queryMustContainer.push({
        match: {
          propertyFlags,
        },
      });
    }

    if (!isNil(priceMin)) {
      queryMustContainer.push({
        range: {
          price: { gte: priceMin },
        },
      });
    }

    if (!isNil(priceMax)) {
      queryMustContainer.push({
        range: {
          price: { lte: priceMax },
        },
      });
    }

    if (!isNil(squareMetersMin)) {
      queryMustContainer.push({
        range: {
          squareMeters: { gte: squareMetersMin },
        },
      });
    }

    if (!isNil(squareMetersMax)) {
      queryMustContainer.push({
        range: {
          squareMeters: { lte: squareMetersMax },
        },
      });
    }

    if (!isNil(queryRootContainer.bool?.must)) {
      queryRootContainer.bool.must = queryMustContainer;
    }

    return queryRootContainer;
  }

  async createPropertyIndex() {
    try {
      await this.elasticsearchService.indices.create({
        index: this.index,
        mappings: {
          properties: {
            title: { type: 'text' },
            location: { type: 'text' },
            description: { type: 'text' },
            propertyType: { type: 'text' },
            squareMeters: { type: 'integer' },
            numberOfRooms: { type: 'text' },
            propertyFlags: { type: 'text' },
            price: { type: 'integer' },
          },
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  async indexProperty({ property }: { property: Property }) {
    await this.elasticsearchService.index({
      index: this.index,
      id: property.url,
      document: property,
    });
  }
}
