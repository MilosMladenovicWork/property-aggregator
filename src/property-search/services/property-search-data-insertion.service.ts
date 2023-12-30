import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class PropertySearchDataInsertionService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async insertDataFromDb() {
    console.log(await this.elasticsearchService.healthReport());
  }
}
