import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { Property } from '../schema/property.schema';
import { PropertyHaloOglasiService } from './property-halo-oglasi.service';

@Injectable()
export class PropertyService {
  constructor(
    private propertyHaloOglasiService: PropertyHaloOglasiService,
    @InjectModel(Property.name) private propertyModel: Model<Property>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async syncPropertiesFromExternalProviders() {
    await this.propertyHaloOglasiService.getPropertiesFromHaloOglasi();
  }

  getAllPropertiesForSearchIndexing(): Promise<Property[]> {
    return this.propertyModel.find().exec();
  }
}
