import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { launch } from 'puppeteer';
import { PropertyHaloOglasiService } from './property-halo-oglasi.service';
import { Property } from './schema/property.schema';

@Injectable()
export class PropertyService {
  constructor(
    @InjectModel(Property.name) private propertyModel: Model<Property>,
    private propertyHaloOglasiService: PropertyHaloOglasiService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async syncPropertiesFromExternalProviders() {
    const browser = await launch({ headless: true });

    await this.propertyHaloOglasiService.getPropertiesFromHaloOglasi({
      browser,
    });

    await browser.close();
  }
}
