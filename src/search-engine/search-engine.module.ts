import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchEngineService } from './services/search-engine.service';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: 'http://localhost:9200',
    }),
  ],
  providers: [SearchEngineService],
  exports: [SearchEngineService],
})
export class SearchEngineModule {}
