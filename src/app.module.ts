import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PropertySearchModule } from './property-search/property-search.module';
import { PropertyModule } from './property/property.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    // IMPORTANT: db needs to be explicitly created
    // before connection can be established
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/property-aggregator', {
      user: 'root',
      pass: 'password',
      authSource: 'admin',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
    PropertyModule,
    PropertySearchModule,
  ],
})
export class AppModule {}
