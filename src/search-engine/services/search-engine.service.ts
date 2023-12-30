import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Property } from 'src/property/schema/property.schema';

@Injectable()
export class SearchEngineService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async searchForProperties({
    query,
    from = 0,
    size = 10,
  }: {
    query?: string | null;
    from?: number;
    size?: number;
  }) {
    const searchMatches = await this.elasticsearchService.search<{
      _id: string;
    }>({
      index: 'properties',
      query: {
        multi_match: {
          query: query ? query : '',
          fields: ['title', 'description', 'location', 'propertyType'],
        },
      },
      from,
      size,
    });

    return searchMatches;
  }

  async createPropertyIndex() {
    try {
      await this.elasticsearchService.indices.create({
        index: 'properties',
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
      index: 'properties',
      id: property.url,
      document: property,
    });
  }
}
