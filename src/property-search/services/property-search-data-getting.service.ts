import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Property } from 'src/property/schema/property.schema';
import { PropertyService } from 'src/property/services/property.service';

@Injectable()
export class PropertySearchDataGettingService {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly propertyService: PropertyService,
  ) {}

  async search({ query }: { query?: string | null }): Promise<Property[]> {
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
      from: 0,
      size: 500,
    });

    const urls = searchMatches.hits.hits.map(({ _id }) => _id);

    return this.propertyService.getAllPropertiesForSearchResults({ urls });
  }
}
