import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { PropertyModule } from 'src/property/property.module';
import { PropertySearchController } from './property-search.controller';
import { PropertySearchDataGettingService } from './services/property-search-data-getting.service';
import { PropertySearchDataInsertionService } from './services/property-search-data-insertion.service';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: 'http://localhost:9200',
    }),
    PropertyModule,
  ],
  providers: [
    PropertySearchDataInsertionService,
    PropertySearchDataGettingService,
  ],
  controllers: [PropertySearchController],
})
export class PropertySearchModule {}
