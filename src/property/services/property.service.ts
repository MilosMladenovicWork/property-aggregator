import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { Property } from '../schema/property.schema';
import { Property4ZidaService } from './property-4-zida.service';
import { PropertyHaloOglasiService } from './property-halo-oglasi.service';

@Injectable()
export class PropertyService {
  constructor(
    private propertyHaloOglasiService: PropertyHaloOglasiService,
    private property4ZidaService: Property4ZidaService,
    @InjectModel(Property.name) private propertyModel: Model<Property>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async syncPropertiesFromExternalProviders() {
    this.propertyHaloOglasiService.getPropertiesFromHaloOglasi();
    this.property4ZidaService.getPropertiesFrom4Zida();
  }

  getAllPropertiesForSearchIndexing(): Promise<Property[]> {
    return this.propertyModel.find().select(['-__v', '-_id']).exec();
  }

  getAllPropertiesForSearchResults({
    urls,
  }: {
    urls: string[];
  }): Promise<Property[]> {
    return this.propertyModel
      .find({ url: { $in: urls } })
      .select(['-__v', '-_id'])
      .exec();
  }
}
