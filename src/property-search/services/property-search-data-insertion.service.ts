import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { PropertyService } from 'src/property/services/property.service';

@Injectable()
export class PropertySearchDataInsertionService {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private propertyService: PropertyService,
  ) {}

  async insertDataFromDb() {
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

    const properties =
      await this.propertyService.getAllPropertiesForSearchIndexing();

    for (const property of properties) {
      await this.elasticsearchService.index({
        index: 'properties',
        id: property.url,
        document: property,
      });
    }
  }
}
