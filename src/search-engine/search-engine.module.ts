import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchEnginePropertiesIndexingService } from './services/search-engine-properties-indexing.service';
import { SearchEnginePropertiesSearchingService } from './services/search-engine-properties-searching.service';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: 'http://localhost:9200',
    }),
  ],
  providers: [
    SearchEnginePropertiesSearchingService,
    SearchEnginePropertiesIndexingService,
  ],
  exports: [
    SearchEnginePropertiesSearchingService,
    SearchEnginePropertiesIndexingService,
  ],
})
export class SearchEngineModule {}
