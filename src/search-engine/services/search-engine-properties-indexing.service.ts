import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Property } from 'src/property/schema/property.schema';
import { SEARCH_ENGINE_PROPERTIES_INDEX } from '../constants/search-engine.constant';

@Injectable()
export class SearchEnginePropertiesIndexingService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  private index = SEARCH_ENGINE_PROPERTIES_INDEX;

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
