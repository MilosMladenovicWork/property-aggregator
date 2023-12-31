import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchEnginePropertiesSearchingService } from './services/search-engine-properties-searching.service';
import { SearchEngineService } from './services/search-engine.service';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: 'http://localhost:9200',
    }),
  ],
  providers: [SearchEngineService, SearchEnginePropertiesSearchingService],
  exports: [SearchEngineService, SearchEnginePropertiesSearchingService],
})
export class SearchEngineModule {}
